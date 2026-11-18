import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { localStore } from '../data/localStore.js';
import { isMongoConnected } from '../config/db.js';

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_jwt_key_eshop_platform_2026_secure',
    { expiresIn: '30d' }
  );
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    if (isMongoConnected) {
      const userExists = await User.findOne({ email: email.toLowerCase() });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const user = await User.create({
        name,
        email: email.toLowerCase(),
        password
      });

      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token: generateToken(user._id)
      });
    }

    // LocalStore fallback
    const existing = localStore.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(password, salt);

    const newUser = localStore.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'user'
    });

    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar || '',
      token: generateToken(newUser._id)
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter both email and password' });
    }

    if (isMongoConnected) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && (await user.matchPassword(password))) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          token: generateToken(user._id)
        });
      } else {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
    }

    // LocalStore fallback
    const user = localStore.getUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = bcrypt.compareSync(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      token: generateToken(user._id)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    if (isMongoConnected) {
      const user = await User.findById(req.user._id).select('-password');
      if (user) return res.json(user);
    }
    const user = localStore.getUserById(req.user._id);
    if (user) {
      const { passwordHash, ...safe } = user;
      return res.json(safe);
    }
    res.status(404).json({ message: 'User not found' });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { name, email, password, avatar } = req.body;

    if (isMongoConnected) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.name = name || user.name;
        user.email = email ? email.toLowerCase() : user.email;
        if (avatar !== undefined) user.avatar = avatar;
        if (password) user.password = password;
        const updated = await user.save();
        return res.json({
          _id: updated._id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          avatar: updated.avatar,
          token: generateToken(updated._id)
        });
      }
    }

    // LocalStore
    const user = localStore.getUserById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email.toLowerCase();
    if (avatar !== undefined) updates.avatar = avatar;
    if (password) {
      const salt = bcrypt.genSaltSync(10);
      updates.passwordHash = bcrypt.hashSync(password, salt);
    }

    const updated = localStore.updateUser(req.user._id, updates);
    const { passwordHash, ...safe } = updated;
    res.json({
      ...safe,
      token: generateToken(updated._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};
