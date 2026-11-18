import { aiRecommendationService } from '../services/aiRecommendationService.js';

export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { currentProductId, category, cartItems } = req.query;

    let cartItemIds = [];
    if (cartItems) {
      cartItemIds = cartItems.split(',');
    }

    const recommendations = await aiRecommendationService.getPersonalized(userId, {
      currentProductId,
      category,
      cartItemIds
    });

    res.json({
      title: 'AI Curated For You',
      confidence: '96% algorithm match',
      count: recommendations.length,
      recommendations
    });
  } catch (err) {
    console.error('getPersonalizedRecommendations error:', err);
    res.status(500).json({ message: 'Error generating recommendations' });
  }
};

export const getFrequentlyBoughtTogether = async (req, res) => {
  try {
    const { productId } = req.params;
    const bundle = await aiRecommendationService.getFrequentlyBoughtTogether(productId);
    res.json(bundle);
  } catch (err) {
    console.error('getFrequentlyBoughtTogether error:', err);
    res.status(500).json({ message: 'Error retrieving bundle recommendations' });
  }
};

export const processSmartSearch = async (req, res) => {
  try {
    const { q } = req.query;
    const result = await aiRecommendationService.processNaturalLanguageQuery(q || '');
    res.json(result);
  } catch (err) {
    console.error('processSmartSearch error:', err);
    res.status(500).json({ message: 'Error performing AI search analysis' });
  }
};
