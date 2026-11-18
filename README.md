# ⚡ NEXUS - Full-Stack MERN E-Commerce Platform

A production-grade, full-stack E-Commerce platform built with **MongoDB, Express.js, React.js, and Node.js (MERN)**, featuring **JWT Authentication**, **Live Product Search & Multi-Faceted Filters**, **Persistent Cart**, **Stripe Checkout Integration**, **Admin Inventory Dashboard**, and **AI-Powered Product Recommendations**.

---

## 🌟 Key Features

### 1. User Authentication (JWT)
- **Role-Based Authorization**: Distinguishes regular shoppers from administrators.
- **Secure Sessions**: Passwords hashed with `bcryptjs` (salt factor 10) and signed with JSON Web Tokens (JWT).
- **Profile Management**: Update user profile credentials and inspect order histories.
- **1-Click Demo Logins**: Pre-configured test accounts for instant evaluation.
  - **Admin**: `admin@eshop.com` / `admin123`
  - **Customer**: `demo@user.com` / `user123`

### 2. Product Listings with Search and Filters
- **Multi-Faceted Filtering**: Filter catalog items by Category, Brand, Price range slider, and Star rating.
- **Instant Search**: Dynamic query evaluation across product titles, descriptions, and tag vectors.
- **Sorting Modes**: Sort by Most Popular, Price: Low to High, Price: High to Low, Highest Rated, or Newest.
- **Stock Indicators**: Real-time stock status with low-stock badges.
- **Detailed Product Pages**: Multi-angle image galleries, technical specs tables, and verified customer reviews.

### 3. Shopping Cart & Stripe Checkout
- **Persistent Cart**: Retains items and quantities across sessions using local storage synchronization.
- **Dynamic Shipping Calculator**: Free expedited shipping unlocked when subtotal exceeds $150.
- **Promo Coupon Engine**: Apply promo discount codes (e.g. `AI10`, `WELCOME10`, `VIP20`).
- **Payment Integration**:
  - **Stripe Elements**: Supports Stripe payment intents and test cards (`4242 4242 4242 4242`).
  - **Cash on Delivery**: Option for physical settlement upon delivery.
  - **Automatic Stock Decrement**: Safely deducts inventory quantities upon completed orders.
- **Instant Receipt & Tracking**: Clean order confirmation breakdown with fulfillment tracking.

### 4. Admin Dashboard for Inventory Management
- **Protected Portal**: Restricted exclusively to users with `role: 'admin'`.
- **Store Metrics Overview**:
  - Total Revenue & Sales Volume.
  - Total Orders & Fulfillment Statuses.
  - Real-time Low-Stock Threshold alerts (&le; 10 units) with 1-click `+20 Refill`.
  - Sales volume breakdown by product category.
- **Full Inventory Control**:
  - Add new products to the catalog (title, price, category, brand, image URL, specs, stock).
  - Edit existing product details.
  - Delete products with automatic list synchronization.
- **Order Management**: Inspect all customer orders and advance status (`Processing` &rarr; `Shipped` &rarr; `Delivered`).
- **User Role Management**: Inspect registered accounts and promote/demote administrator rights.

### 5. Advanced Add-On: AI-Powered Recommendations
- **Personalized "Curated for You" Recommendations**:
  - Content-based and collaborative filtering based on browsing categories, active cart items, and purchase history.
  - Displays explainable AI confidence scores (e.g. `98% Match`) and match reasons (e.g. *"Matches your interest in Audio"*).
- **Smart Product Bundling ("Frequently Bought Together")**:
  - Pairs complementary products (e.g., Laptop + Wireless Mouse, Camera + Lens).
  - Calculates automatic 10% bundle savings with 1-click **Add All to Cart**.
- **Natural Language AI Shopping Assistant**:
  - Natural language query parser (e.g., *"wireless noise-canceling headphones for long flights under $350"*).
  - Evaluates budget constraints, categories, and semantic tokens to surface ranked matches.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, React Router v6, Axios |
| **Backend** | Node.js, Express.js, JWT, bcryptjs, Stripe SDK, Mongoose |
| **Database** | MongoDB (with Mongoose schemas & resilient local fallback persistence store) |

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+)
- npm

### 1. Installation
Clone the repository and install all dependencies:
```bash
npm run install:all
```
*(Or run `npm install` inside both `/backend` and `/frontend`)*

### 2. Environment Configuration
The backend comes pre-configured with default development settings in `backend/.env`.
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ecommerce_db
JWT_SECRET=super_secret_jwt_key_eshop_platform_2026_secure
STRIPE_SECRET_KEY=sk_test_mock_stripe_key
STRIPE_PUBLISHABLE_KEY=pk_test_mock_stripe_key
CLIENT_URL=http://localhost:5173
```
*Note: If a local MongoDB instance is not active, the backend automatically activates the high-performance local store so you can immediately test all features without setup.*

### 3. Run the Platform

**Start Backend Server:**
```bash
npm run backend
# Runs Express on http://localhost:5000
```

**Start Frontend Application:**
```bash
npm run frontend
# Runs Vite on http://localhost:5173
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create account & return JWT
- `POST /api/auth/login` - Sign in user & return JWT
- `GET /api/auth/profile` - Protected: Get current user profile
- `PUT /api/auth/profile` - Protected: Update current user profile

### Products (`/api/products`)
- `GET /api/products` - Filtered product catalog (query params: `keyword`, `category`, `brand`, `minPrice`, `maxPrice`, `minRating`, `inStock`, `sort`, `page`)
- `GET /api/products/filters` - Category, brand, and price range metadata
- `GET /api/products/:id` - Detailed product specs and reviews
- `POST /api/products/:id/reviews` - Protected: Submit customer review

### Orders (`/api/orders`)
- `POST /api/orders` - Protected: Create order & reserve inventory
- `GET /api/orders/myorders` - Protected: Get authenticated user's order history
- `GET /api/orders/:id` - Protected: Get specific order details
- `PUT /api/orders/:id/pay` - Protected: Mark order as paid

### Admin (`/api/admin`)
- `GET /api/admin/stats` - Admin: Dashboard summary metrics & low-stock alerts
- `GET /api/admin/products` - Admin: All inventory items
- `POST /api/admin/products` - Admin: Add new catalog product
- `PUT /api/admin/products/:id` - Admin: Update product / stock level
- `DELETE /api/admin/products/:id` - Admin: Remove product
- `GET /api/admin/orders` - Admin: Inspect all customer orders
- `PUT /api/admin/orders/:id/status` - Admin: Update order fulfillment status
- `GET /api/admin/users` - Admin: Manage user accounts & roles

### AI Recommendations (`/api/recommendations`)
- `GET /api/recommendations/personalized` - Scored recommendations with reasoning
- `GET /api/recommendations/bundle/:productId` - Frequently bought together bundle
- `GET /api/recommendations/search-assistant?q=...` - Natural language query analysis

### Payments (`/api/payment`)
- `POST /api/payment/create-payment-intent` - Initialize Stripe payment intent
- `GET /api/payment/config` - Get Stripe public configuration

---

## 🔒 Security & Best Practices
- **Password Protection**: BCrypt one-way password hashing.
- **Stateless Tokens**: JWT with signature verification on all protected endpoints.
- **CORS & Sanitization**: Restrictive HTTP method handlers.
- **Graceful Error Handling**: Centralized error middleware returning clean status codes.
