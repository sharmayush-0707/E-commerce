import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import AISearchModal from './components/ai/AISearchModal';

import HomePage from './pages/HomePage';
import ShopPage from './pages/ShopPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import AdminDashboardPage from './pages/AdminDashboardPage';

import { productAPI } from './services/api';

export default function App() {
  const [isAISearchOpen, setIsAISearchOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Pre-fetch featured products for HomePage showcase
    productAPI.getProducts({ limit: 4, sort: 'popularity' })
      .then(res => {
        setFeaturedProducts(res.data.products || []);
      })
      .catch(err => console.error('Failed fetching featured products', err));
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar onOpenAISearch={() => setIsAISearchOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                onOpenAISearch={() => setIsAISearchOpen(true)}
                featuredProducts={featuredProducts}
              />
            }
          />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:id" element={<OrderSuccessPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Routes>
      </main>

      <Footer />

      {/* Global AI Search Modal */}
      <AISearchModal
        isOpen={isAISearchOpen}
        onClose={() => setIsAISearchOpen(false)}
      />
    </div>
  );
}
