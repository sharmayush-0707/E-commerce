import { stripeService } from '../services/stripeService.js';

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid payment amount' });
    }

    const customerEmail = req.user ? req.user.email : 'guest@checkout.com';
    const intent = await stripeService.createPaymentIntent({
      amount: Number(amount),
      currency,
      customerEmail,
      metadata: { orderId: orderId || 'temp' }
    });

    res.json(intent);
  } catch (err) {
    console.error('createPaymentIntent error:', err);
    res.status(500).json({ message: 'Payment initiation error' });
  }
};

export const getStripeConfig = async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_mock_key',
    isLiveConfigured: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('mock'))
  });
};
