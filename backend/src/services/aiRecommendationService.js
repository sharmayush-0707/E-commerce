import { localStore } from '../data/localStore.js';
import Product from '../models/Product.js';
import { isMongoConnected } from '../config/db.js';

async function fetchAllProducts() {
  if (isMongoConnected) {
    try {
      const list = await Product.find({}).lean();
      if (list && list.length > 0) return list;
    } catch (e) {
      console.warn('Fallback to localStore for products in AI service');
    }
  }
  return localStore.getProducts();
}

/**
 * AI-powered Product Recommendation Service
 */
export const aiRecommendationService = {
  /**
   * Get personalized recommendations for a user based on context
   */
  async getPersonalized(userId = null, context = {}) {
    const products = await fetchAllProducts();
    const { currentProductId, category, cartItemIds = [], history = [] } = context;

    // Filter out current product
    let pool = products.filter(p => p._id !== currentProductId);

    // Identify user affinity categories and tags
    const targetCategories = new Set();
    const targetTags = new Set();

    if (category) targetCategories.add(category.toLowerCase());

    // Inspect cart items
    if (Array.isArray(cartItemIds) && cartItemIds.length > 0) {
      for (const id of cartItemIds) {
        const item = products.find(p => p._id === id);
        if (item) {
          targetCategories.add(item.category.toLowerCase());
          if (item.tags) item.tags.forEach(t => targetTags.add(t.toLowerCase()));
        }
      }
    }

    // Inspect user's past orders if userId provided
    if (userId) {
      const orders = localStore.getUserOrders(userId);
      for (const ord of orders) {
        for (const item of ord.orderItems || []) {
          const p = products.find(prod => prod._id === item.product);
          if (p) {
            targetCategories.add(p.category.toLowerCase());
            if (p.tags) p.tags.forEach(t => targetTags.add(t.toLowerCase()));
          }
        }
      }
    }

    // Score each product in the pool
    const scored = pool.map(product => {
      let score = 50; // base score
      let reasons = [];

      // Category match
      if (targetCategories.has(product.category.toLowerCase())) {
        score += 25;
        reasons.push(`Matches your interest in ${product.category}`);
      }

      // Tag overlap
      if (product.tags) {
        let tagMatches = 0;
        for (const t of product.tags) {
          if (targetTags.has(t.toLowerCase())) tagMatches++;
        }
        if (tagMatches > 0) {
          score += Math.min(tagMatches * 8, 24);
          reasons.push('Aligns with your recent browsing tags');
        }
      }

      // Rating boost
      if (product.rating >= 4.7) {
        score += 15;
        reasons.push(`Top-rated customer favorite (${product.rating}★)`);
      }

      // Trending boost
      if (product.isTrending) {
        score += 10;
        reasons.push('High popularity momentum this week');
      }

      // Discount bonus
      if (product.discountPercentage > 10) {
        score += 8;
        reasons.push(`Special deal (${product.discountPercentage}% OFF)`);
      }

      // Default reason if empty
      if (reasons.length === 0) {
        reasons.push('Hand-curated editor pick based on performance');
      }

      // Match confidence between 78% and 99%
      const matchScore = Math.min(Math.max(Math.round(score), 76), 99);

      return {
        ...product,
        aiScore: matchScore,
        aiReason: reasons[0],
        aiSecondaryReason: reasons[1] || 'Highly recommended by our AI curation engine'
      };
    });

    // Sort descending by AI score
    scored.sort((a, b) => b.aiScore - a.aiScore);

    return scored.slice(0, 6);
  },

  /**
   * Frequently Bought Together (Smart Bundling)
   */
  async getFrequentlyBoughtTogether(productId) {
    const products = await fetchAllProducts();
    const current = products.find(p => p._id === productId);
    if (!current) return [];

    // Find complementary products (different subcategory, same or complementary category)
    const complementaries = products.filter(p => {
      if (p._id === productId) return false;
      // Audio + Accessories / Computers + Accessories
      if (current.category === 'Electronics' && (p.category === 'Electronics' || p.category === 'Wearables')) return true;
      if (current.category === 'Photography' && p.category === 'Electronics') return true;
      if (current.category === 'Home & Kitchen' && p.category === 'Home & Kitchen') return true;
      if (current.category === 'Footwear' && p.category === 'Fashion') return true;
      return p.category === current.category;
    });

    // Pick top 2 best companions
    const bundlePartners = complementaries
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 2);

    const bundleItems = [current, ...bundlePartners];
    const originalTotal = bundleItems.reduce((acc, it) => acc + (it.price || 0), 0);
    const bundleDiscount = 0.10; // 10% bundle deal
    const discountedTotal = parseFloat((originalTotal * (1 - bundleDiscount)).toFixed(2));
    const savings = parseFloat((originalTotal - discountedTotal).toFixed(2));

    return {
      primaryProduct: current,
      bundleProducts: bundlePartners,
      originalTotal: parseFloat(originalTotal.toFixed(2)),
      bundleTotal: discountedTotal,
      savingsAmount: savings,
      savingsPercentage: 10
    };
  },

  /**
   * Natural Language AI Search & Semantic Query Analyzer
   * e.g., "looking for comfortable headphones under $350 for travel"
   */
  async processNaturalLanguageQuery(query = '') {
    const products = await fetchAllProducts();
    if (!query.trim()) {
      return {
        query,
        extractedIntent: {},
        summary: 'Showing top curated products',
        results: products.slice(0, 6)
      };
    }

    const q = query.toLowerCase();

    // 1. Price constraint detection
    let maxPrice = null;
    let minPrice = null;
    const underMatch = q.match(/under\s*\$?(\d+(\.\d+)?)/i) || q.match(/below\s*\$?(\d+(\.\d+)?)/i) || q.match(/less\s*than\s*\$?(\d+(\.\d+)?)/i);
    if (underMatch) maxPrice = parseFloat(underMatch[1]);

    const aboveMatch = q.match(/above\s*\$?(\d+(\.\d+)?)/i) || q.match(/over\s*\$?(\d+(\.\d+)?)/i) || q.match(/more\s*than\s*\$?(\d+(\.\d+)?)/i);
    if (aboveMatch) minPrice = parseFloat(aboveMatch[1]);

    // 2. Category intent
    const categoryKeywords = {
      Electronics: ['electronics', 'laptop', 'computer', 'mouse', 'keyboard', 'screenbar', 'tech'],
      Audio: ['audio', 'headphone', 'headphones', 'sound', 'music', 'speaker', 'earbuds', 'noise-canceling', 'anc', 'bass'],
      Wearables: ['watch', 'smartwatch', 'glasses', 'sunglasses', 'wearable', 'fitness'],
      Photography: ['camera', 'photo', 'video', 'lens', 'cinematography', 'mirrorless', '4k'],
      Footwear: ['shoes', 'shoe', 'sneakers', 'running', 'gym', 'trainers', 'nike'],
      Fashion: ['fashion', 'backpack', 'bag', 'leather', 'tote', 'wallet', 'style'],
      "Home & Kitchen": ['kitchen', 'coffee', 'grinder', 'kettle', 'pour-over', 'home']
    };

    let matchedCategory = null;
    for (const [cat, words] of Object.entries(categoryKeywords)) {
      if (words.some(w => q.includes(w))) {
        matchedCategory = cat;
        break;
      }
    }

    // 3. Tokenize and score products
    const queryTokens = q
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2 && !['for', 'the', 'and', 'with', 'under', 'below', 'over', 'looking', 'best', 'good'].includes(w));

    const scored = products.map(product => {
      let score = 0;
      let matchedAttributes = [];

      // Price filter check
      if (maxPrice !== null && product.price > maxPrice) {
        score -= 60;
      } else if (maxPrice !== null && product.price <= maxPrice) {
        score += 25;
        matchedAttributes.push(`Within budget (< $${maxPrice})`);
      }

      if (minPrice !== null && product.price < minPrice) {
        score -= 60;
      }

      // Check category match
      if (matchedCategory && (product.category.toLowerCase() === matchedCategory.toLowerCase() || (product.subCategory && product.subCategory.toLowerCase() === matchedCategory.toLowerCase()))) {
        score += 35;
        matchedAttributes.push(`Category: ${product.category}`);
      }

      // Check tokens against name, description, tags, and aiKeywords
      const searchableText = `${product.name} ${product.description} ${product.brand} ${(product.tags || []).join(' ')} ${(product.aiKeywords || []).join(' ')}`.toLowerCase();

      for (const token of queryTokens) {
        if (product.name.toLowerCase().includes(token)) {
          score += 30;
          matchedAttributes.push(`Keyword in title: "${token}"`);
        } else if ((product.tags || []).some(t => t.toLowerCase().includes(token))) {
          score += 20;
          matchedAttributes.push(`Tag: ${token}`);
        } else if ((product.aiKeywords || []).some(k => k.toLowerCase().includes(token))) {
          score += 20;
          matchedAttributes.push(`Feature: ${token}`);
        } else if (searchableText.includes(token)) {
          score += 10;
        }
      }

      // Rating bonus
      score += (product.rating || 0) * 4;

      const confidence = Math.min(Math.max(Math.round(score), 40), 99);

      return {
        ...product,
        aiSearchScore: confidence,
        matchedReason: matchedAttributes.slice(0, 2).join(' • ') || 'Semantic content similarity match'
      };
    });

    // Filter out negative or very poor matches unless all are low
    const results = scored
      .filter(p => p.aiSearchScore >= 50)
      .sort((a, b) => b.aiSearchScore - a.aiSearchScore);

    const finalResults = results.length > 0 ? results : scored.sort((a, b) => b.aiSearchScore - a.aiSearchScore).slice(0, 4);

    return {
      query,
      extractedIntent: {
        maxPrice,
        minPrice,
        detectedCategory: matchedCategory,
        tokens: queryTokens
      },
      summary: `Found ${finalResults.length} smart AI matches for "${query}"${maxPrice ? ` under $${maxPrice}` : ''}${matchedCategory ? ` in ${matchedCategory}` : ''}.`,
      results: finalResults
    };
  }
};
