import express from 'express';
import {
  getProducts,
  getProductById,
  getCategoriesAndFilters,
  createProductReview
} from '../controllers/productController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/filters', getCategoriesAndFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);

export default router;
