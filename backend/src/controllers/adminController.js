import { localStore } from '../data/localStore.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import { isMongoConnected } from '../config/db.js';

export const getDashboardStats = async (req, res) => {
  try {
    const products = localStore.getProducts();
    const orders = localStore.getAllOrders();
    const users = localStore.getAllUsers();

    // Calculate revenue
    const totalRevenue = orders
      .filter(o => o.isPaid)
      .reduce((acc, o) => acc + (o.totalPrice || 0), 0);

    // Low stock products
    const lowStockProducts = products.filter(p => p.stock <= 10);

    // Sales by category
    const categorySales = {};
    orders.forEach(order => {
      (order.orderItems || []).forEach(item => {
        const prod = products.find(p => p._id === item.product);
        const cat = prod ? prod.category : 'General';
        categorySales[cat] = (categorySales[cat] || 0) + (item.price * item.quantity);
      });
    });

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    // Order status counts
    const statusCounts = {
      Processing: orders.filter(o => o.status === 'Processing').length,
      Shipped: orders.filter(o => o.status === 'Shipped').length,
      Delivered: orders.filter(o => o.status === 'Delivered').length,
      Cancelled: orders.filter(o => o.status === 'Cancelled').length
    };

    res.json({
      summary: {
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        lowStockCount: lowStockProducts.length
      },
      lowStockProducts,
      recentOrders,
      categorySales,
      statusCounts
    });
  } catch (err) {
    console.error('getDashboardStats error:', err);
    res.status(500).json({ message: 'Error retrieving dashboard metrics' });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = localStore.getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching products' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      originalPrice,
      description,
      image,
      images,
      brand,
      category,
      subCategory,
      stock,
      tags,
      specs
    } = req.body;

    if (!name || !price || !category || !brand) {
      return res.status(400).json({ message: 'Name, price, category, and brand are required' });
    }

    const newProd = localStore.createProduct({
      name,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Number(price),
      discountPercentage: originalPrice && originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0,
      description: description || 'High quality product designed for performance and style.',
      image: image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      images: Array.isArray(images) && images.length ? images : [image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'],
      brand,
      category,
      subCategory: subCategory || '',
      stock: Number(stock) || 0,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()) : []),
      specs: specs || {}
    });

    res.status(201).json(newProd);
  } catch (err) {
    console.error('createProduct error:', err);
    res.status(500).json({ message: 'Error creating product' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.stock !== undefined) updateData.stock = Number(updateData.stock);

    const updated = localStore.updateProduct(id, updateData);
    if (!updated) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const success = localStore.deleteProduct(id);
    if (!success) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully', id });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = localStore.getAllOrders();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Processing', 'Shipped', 'Delivered', 'Cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid order status' });
    }

    const updated = localStore.updateOrderStatus(id, status);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = localStore.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be user or admin' });
    }

    const updated = localStore.updateUser(id, { role });
    if (!updated) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { passwordHash, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};
