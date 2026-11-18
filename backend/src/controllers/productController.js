import Product from '../models/Product.js';
import { localStore } from '../data/localStore.js';
import { isMongoConnected } from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort,
      page = 1,
      limit = 12
    } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    let allFiltered = [];

    if (isMongoConnected) {
      try {
        const query = {};
        if (keyword) {
          query.$or = [
            { name: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { tags: { $in: [new RegExp(keyword, 'i')] } }
          ];
        }
        if (category && category !== 'All') {
          query.category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        if (brand && brand !== 'All') {
          query.brand = { $regex: new RegExp(`^${brand}$`, 'i') };
        }
        if (minPrice || maxPrice) {
          query.price = {};
          if (minPrice) query.price.$gte = Number(minPrice);
          if (maxPrice) query.price.$lte = Number(maxPrice);
        }
        if (minRating) {
          query.rating = { $gte: Number(minRating) };
        }
        if (inStock === 'true') {
          query.stock = { $gt: 0 };
        }

        let sortOption = { numReviews: -1 };
        if (sort === 'price-asc') sortOption = { price: 1 };
        if (sort === 'price-desc') sortOption = { price: -1 };
        if (sort === 'rating') sortOption = { rating: -1 };
        if (sort === 'newest') sortOption = { createdAt: -1 };

        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
          .sort(sortOption)
          .skip((pageNum - 1) * limitNum)
          .limit(limitNum);

        return res.json({
          products,
          page: pageNum,
          pages: Math.ceil(total / limitNum) || 1,
          total
        });
      } catch (err) {
        console.warn('Mongo product query failed, falling back to localStore');
      }
    }

    // LocalStore handling
    allFiltered = localStore.getProducts({
      keyword,
      category,
      brand,
      minPrice,
      maxPrice,
      minRating,
      inStock,
      sort
    });

    const total = allFiltered.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginated = allFiltered.slice(startIndex, startIndex + limitNum);

    res.json({
      products: paginated,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      total
    });
  } catch (err) {
    console.error('getProducts error:', err);
    res.status(500).json({ message: 'Error retrieving products' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoConnected) {
      try {
        const product = await Product.findById(id);
        if (product) return res.json(product);
      } catch (e) {
        // ID may not be valid ObjectId, fallback to localStore
      }
    }

    const product = localStore.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const reviews = localStore.getReviewsForProduct(id);

    res.json({
      ...product,
      reviews: reviews.length > 0 ? reviews : (product.reviews || [])
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product details' });
  }
};

export const getCategoriesAndFilters = async (req, res) => {
  try {
    const products = localStore.getProducts();
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const brands = ['All', ...new Set(products.map(p => p.brand))];
    const prices = products.map(p => p.price);
    const minPrice = Math.floor(Math.min(...prices));
    const maxPrice = Math.ceil(Math.max(...prices));

    res.json({
      categories,
      brands,
      priceRange: { min: minPrice, max: maxPrice }
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching filter options' });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Rating and review comment are required' });
    }

    const product = localStore.getProductById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const review = localStore.addReview({
      productId,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      userId: req.user._id
    });

    res.status(201).json({ message: 'Review added successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Error adding review' });
  }
};
