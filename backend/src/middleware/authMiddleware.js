import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { localStore } from '../data/localStore.js';
import { isMongoConnected } from '../config/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_eshop_platform_2026_secure'
      );

      if (isMongoConnected) {
        req.user = await User.findById(decoded.id).select('-password');
      } else {
        const found = localStore.getUserById(decoded.id);
        if (found) {
          const { passwordHash, ...safeUser } = found;
          req.user = safeUser;
        }
      }

      if (!req.user) {
        return res.status(401).json({ message: 'User not found or token invalid' });
      }

      return next();
    } catch (error) {
      console.error('JWT protect error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied: Admin privileges required' });
  }
};
