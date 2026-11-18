import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Sparkles,
  User,
  LogOut,
  ShieldCheck,
  Search,
  Menu,
  X,
  PackageCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Navbar({ onOpenAISearch }) {
  const { user, isAdmin, logout } = useAuth();
  const { totalItemsCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-700 bg-clip-text text-transparent">
                NEXUS<span className="text-indigo-600">.ai</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
              <Link to="/" className="hover:text-indigo-600 transition-colors">
                Home
              </Link>
              <Link to="/shop" className="hover:text-indigo-600 transition-colors">
                Explore Store
              </Link>
              <button
                onClick={onOpenAISearch}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200/60 transition-all text-xs font-semibold shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>AI Search Assistant</span>
              </button>
            </nav>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Quick search button */}
            <button
              onClick={onOpenAISearch}
              className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-2 text-sm text-slate-400"
              title="Open Search"
            >
              <Search className="w-5 h-5 text-slate-500" />
              <span className="hidden lg:inline text-xs bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-slate-500">
                Ask AI...
              </span>
            </button>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 bg-indigo-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
                  {totalItemsCount}
                </span>
              )}
            </Link>

            {/* User Dropdown / Auth Links */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pl-3 pr-2.5 rounded-full bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-colors text-xs font-semibold text-slate-800"
                >
                  <span className="max-w-[100px] truncate">{user.name.split(' ')[0]}</span>
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3 h-3" /> Admin
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Profile & Orders
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-indigo-700 hover:bg-indigo-50 font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Home
            </Link>
            <Link
              to="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-100"
            >
              Explore Store
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAISearch();
              }}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-indigo-700 bg-indigo-50"
            >
              <span>AI Search Assistant</span>
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </button>
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-amber-700 bg-amber-50"
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
