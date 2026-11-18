import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import { initialProducts, initialUsers, initialOrders, initialReviews } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db_local_backup.json');

class LocalStore {
  constructor() {
    this.data = {
      products: [],
      users: [],
      orders: [],
      reviews: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Make sure admin and demo passwords can be verified
        this.ensureDefaultUsers();
        return;
      } catch (err) {
        console.warn('Failed reading existing local DB file, reinitializing fresh.');
      }
    }

    // Initialize with fresh seed data
    const salt = bcrypt.genSaltSync(10);
    const adminHash = bcrypt.hashSync('admin123', salt);
    const userHash = bcrypt.hashSync('user123', salt);

    this.data = {
      products: [...initialProducts],
      users: [
        {
          _id: "usr-admin-1",
          name: "Admin Manager",
          email: "admin@eshop.com",
          role: "admin",
          passwordHash: adminHash,
          createdAt: new Date().toISOString()
        },
        {
          _id: "usr-demo-1",
          name: "Jane Doe",
          email: "demo@user.com",
          role: "user",
          passwordHash: userHash,
          createdAt: new Date().toISOString()
        }
      ],
      orders: [...initialOrders],
      reviews: [...initialReviews]
    };
    this.save();
  }

  ensureDefaultUsers() {
    const salt = bcrypt.genSaltSync(10);
    const admin = this.data.users?.find(u => u.email === 'admin@eshop.com');
    if (!admin) {
      this.data.users.push({
        _id: "usr-admin-1",
        name: "Admin Manager",
        email: "admin@eshop.com",
        role: "admin",
        passwordHash: bcrypt.hashSync('admin123', salt),
        createdAt: new Date().toISOString()
      });
      this.save();
    }
    const demo = this.data.users?.find(u => u.email === 'demo@user.com');
    if (!demo) {
      this.data.users.push({
        _id: "usr-demo-1",
        name: "Jane Doe",
        email: "demo@user.com",
        role: "user",
        passwordHash: bcrypt.hashSync('user123', salt),
        createdAt: new Date().toISOString()
      });
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write local backup file', e);
    }
  }

  // Generic helpers
  getProducts(filter = {}) {
    let result = [...this.data.products];
    if (filter.category && filter.category !== 'All') {
      result = result.filter(p => p.category.toLowerCase() === filter.category.toLowerCase());
    }
    if (filter.brand && filter.brand !== 'All') {
      result = result.filter(p => p.brand.toLowerCase() === filter.brand.toLowerCase());
    }
    if (filter.minPrice !== undefined) {
      result = result.filter(p => p.price >= Number(filter.minPrice));
    }
    if (filter.maxPrice !== undefined) {
      result = result.filter(p => p.price <= Number(filter.maxPrice));
    }
    if (filter.minRating !== undefined) {
      result = result.filter(p => p.rating >= Number(filter.minRating));
    }
    if (filter.inStock === true || filter.inStock === 'true') {
      result = result.filter(p => p.stock > 0);
    }
    if (filter.keyword) {
      const q = filter.keyword.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q))) ||
        (p.aiKeywords && p.aiKeywords.some(k => k.toLowerCase().includes(q)))
      );
    }

    // Sorting
    if (filter.sort) {
      switch (filter.sort) {
        case 'price-asc':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price-desc':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => (b.createdAt || 0) > (a.createdAt || 0) ? 1 : -1);
          break;
        case 'popularity':
        default:
          result.sort((a, b) => (b.numReviews || 0) - (a.numReviews || 0));
          break;
      }
    }

    return result;
  }

  getProductById(id) {
    return this.data.products.find(p => p._id === id);
  }

  createProduct(productData) {
    const newProduct = {
      _id: 'prod-' + Date.now(),
      rating: 5.0,
      numReviews: 1,
      createdAt: new Date().toISOString(),
      ...productData
    };
    this.data.products.unshift(newProduct);
    this.save();
    return newProduct;
  }

  updateProduct(id, updateData) {
    const index = this.data.products.findIndex(p => p._id === id);
    if (index === -1) return null;
    this.data.products[index] = {
      ...this.data.products[index],
      ...updateData,
      _id: id // preserve ID
    };
    this.save();
    return this.data.products[index];
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p._id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // Users
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u._id === id);
  }

  createUser(userData) {
    const newUser = {
      _id: 'usr-' + Date.now(),
      createdAt: new Date().toISOString(),
      role: 'user',
      ...userData
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  updateUser(id, updateData) {
    const index = this.data.users.findIndex(u => u._id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updateData, _id: id };
    this.save();
    return this.data.users[index];
  }

  getAllUsers() {
    return this.data.users.map(({ passwordHash, ...user }) => user);
  }

  // Orders
  createOrder(orderData) {
    const newOrder = {
      _id: 'ord-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Processing',
      isPaid: false,
      ...orderData
    };
    this.data.orders.unshift(newOrder);

    // Decrement stock for ordered items
    if (Array.isArray(newOrder.orderItems)) {
      for (const item of newOrder.orderItems) {
        const product = this.getProductById(item.product);
        if (product && product.stock >= item.quantity) {
          product.stock -= item.quantity;
        }
      }
    }

    this.save();
    return newOrder;
  }

  getOrderById(id) {
    return this.data.orders.find(o => o._id === id);
  }

  getUserOrders(userId) {
    return this.data.orders.filter(o => o.user === userId || o.customerEmail === userId);
  }

  getAllOrders() {
    return this.data.orders;
  }

  updateOrderStatus(id, status) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.status = status;
    if (status === 'Delivered') {
      order.deliveredAt = new Date().toISOString();
    }
    this.save();
    return order;
  }

  updateOrderToPaid(id, paymentResult) {
    const order = this.getOrderById(id);
    if (!order) return null;
    order.isPaid = true;
    order.paidAt = new Date().toISOString();
    order.paymentResult = paymentResult;
    this.save();
    return order;
  }

  // Reviews
  getReviewsForProduct(productId) {
    return this.data.reviews.filter(r => r.productId === productId);
  }

  addReview(reviewData) {
    const newRev = {
      _id: 'rev-' + Date.now(),
      createdAt: new Date().toISOString(),
      ...reviewData
    };
    this.data.reviews.unshift(newRev);

    // Recalculate product rating
    const reviews = this.getReviewsForProduct(reviewData.productId);
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const prod = this.getProductById(reviewData.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.numReviews = reviews.length;
    }

    this.save();
    return newRev;
  }
}

export const localStore = new LocalStore();
