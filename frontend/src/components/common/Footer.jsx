import React from 'react';
import { Sparkles, Shield, Truck, RefreshCw, CreditCard, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value proposition badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Expedited Delivery</h4>
              <p className="text-xs text-slate-400">On all orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Stripe 256-bit Security</h4>
              <p className="text-xs text-slate-400">Encrypted PCI-compliant payments</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">AI Recommendations</h4>
              <p className="text-xs text-slate-400">Tailored to your preferences</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Hassle Returns</h4>
              <p className="text-xs text-slate-400">Money-back guarantee</p>
            </div>
          </div>
        </div>

        {/* Footer main links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-white">
                NEXUS<span className="text-indigo-400">.ai</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              Next-generation MERN e-commerce experience powered by AI recommendations, real-time inventory management, and enterprise Stripe payments.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Tech Stack: React 18, Express, MongoDB, Node.js & Stripe
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Shop</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><Link to="/shop?category=Electronics" className="hover:text-white transition-colors">Electronics & Audio</Link></li>
              <li><Link to="/shop?category=Wearables" className="hover:text-white transition-colors">Smart Wearables</Link></li>
              <li><Link to="/shop?category=Fashion" className="hover:text-white transition-colors">Lifestyle & Bags</Link></li>
              <li><Link to="/shop?category=Home%20%26%20Kitchen" className="hover:text-white transition-colors">Home & Coffee</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Features</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-slate-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">Smart Product Filters</Link></li>
              <li><Link to="/cart" className="hover:text-white transition-colors">Persistent Cart</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">JWT Authentication</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Inventory Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Demo Credentials</h3>
            <div className="mt-4 text-xs text-slate-400 space-y-2 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <p><span className="font-semibold text-slate-200">Admin:</span> admin@eshop.com</p>
              <p><span className="font-semibold text-slate-200">Password:</span> admin123</p>
              <p className="pt-1 border-t border-slate-700"><span className="font-semibold text-slate-200">User:</span> demo@user.com / user123</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 NEXUS E-Commerce Platform. Built with modern MERN Architecture.</p>
          <div className="flex items-center gap-4 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>API Docs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
