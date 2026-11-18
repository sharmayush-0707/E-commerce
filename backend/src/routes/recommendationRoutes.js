import express from 'express';
import {
  getPersonalizedRecommendations,
  getFrequentlyBoughtTogether,
  processSmartSearch
} from '../controllers/recommendationController.js';

const router = express.Router();

router.get('/personalized', getPersonalizedRecommendations);
router.get('/bundle/:productId', getFrequentlyBoughtTogether);
router.get('/search-assistant', processSmartSearch);

export default router;
