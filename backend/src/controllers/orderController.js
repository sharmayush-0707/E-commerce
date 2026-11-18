import Order from '../models/Order.js';
import { localStore } from '../data/localStore.js';
import { isMongoConnected } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items in cart' });
    }

    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ message: 'Shipping address is incomplete' });
    }

    const orderData = {
      user: req.user._id,
      customerName: req.user.name,
      customerEmail: req.user.email,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'Stripe',
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
      isPaid: false
    };

    if (isMongoConnected) {
      try {
        const order = new Order(orderData);
        const createdOrder = await order.save();
        return res.status(201).json(createdOrder);
      } catch (e) {
        console.warn('Mongo order save failed, fallback to localStore');
      }
    }

    const createdOrder = localStore.createOrder(orderData);
    res.status(201).json(createdOrder);
  } catch (err) {
    console.error('createOrder error:', err);
    res.status(500).json({ message: 'Error processing order' });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      try {
        const order = await Order.findById(id).populate('user', 'name email');
        if (order) return res.json(order);
      } catch (e) {}
    }

    const order = localStore.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Ensure authorized: admin or owner
    if (req.user.role !== 'admin' && String(order.user) !== String(req.user._id) && order.customerEmail !== req.user.email) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving order' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (isMongoConnected) {
      try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        return res.json(orders);
      } catch (e) {}
    }

    const orders = localStore.getUserOrders(req.user._id);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving user orders' });
  }
};

export const updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { id: paymentId, status, email_address } = req.body;

    const paymentResult = {
      id: paymentId || `pi_stripe_${Date.now()}`,
      status: status || 'succeeded',
      update_time: new Date().toISOString(),
      email_address: email_address || req.user.email
    };

    if (isMongoConnected) {
      try {
        const order = await Order.findById(id);
        if (order) {
          order.isPaid = true;
          order.paidAt = Date.now();
          order.paymentResult = paymentResult;
          order.status = 'Processing';
          const updated = await order.save();
          return res.json(updated);
        }
      } catch (e) {}
    }

    const updated = localStore.updateOrderToPaid(id, paymentResult);
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating payment status' });
  }
};
