import express from 'express';
import {
  getDashboardStats,
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  getAllUsers,
  updateUserRole
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All admin routes require protect and admin
router.use(protect, admin);

router.get('/stats', getDashboardStats);

router.route('/products')
  .get(getAllProducts)
  .post(createProduct);

router.route('/products/:id')
  .put(updateProduct)
  .delete(deleteProduct);

router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);

router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);

export default router;
