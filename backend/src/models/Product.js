import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    tagline: {
      type: String,
      default: ''
    },
    image: {
      type: String,
      required: true
    },
    images: [
      {
        type: String
      }
    ],
    brand: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    subCategory: {
      type: String,
      default: ''
    },
    description: {
      type: String,
      required: true
    },
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0
    },
    price: {
      type: Number,
      required: true,
      default: 0
    },
    originalPrice: {
      type: Number,
      default: 0
    },
    discountPercentage: {
      type: Number,
      default: 0
    },
    stock: {
      type: Number,
      required: true,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isTrending: {
      type: Boolean,
      default: false
    },
    tags: [String],
    specs: {
      type: Map,
      of: String
    },
    aiKeywords: [String]
  },
  {
    timestamps: true
  }
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
