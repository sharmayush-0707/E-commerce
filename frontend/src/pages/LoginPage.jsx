import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      if (res.data.role === 'admin' && redirect === '/') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    login(demoEmail, demoPassword).then((res) => {
      if (res.success) {
        if (res.data.role === 'admin') {
          navigate('/admin');
        } else {
          navigate(redirect);
        }
      }
    });
  };

  return (
    <div className="py-12 max-w-md mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white mx-auto shadow-md shadow-indigo-500/20">
          <Sparkles className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to NEXUS
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to your account to access your cart, orders, and AI personalized feed.
        </p>
      </div>

      {/* Quick Demo Credential Pills */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl space-y-2.5">
        <p className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider text-center">
          Instant 1-Click Demo Logins
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickLogin('demo@user.com', 'user123')}
            className="p-2.5 rounded-xl bg-white hover:bg-indigo-100/60 border border-indigo-200/80 text-xs font-bold text-indigo-900 flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            Demo User
          </button>
          <button
            type="button"
            onClick={() => handleQuickLogin('admin@eshop.com', 'admin123')}
            className="p-2.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200/80 text-xs font-bold text-amber-900 flex items-center justify-center gap-1.5 transition-all shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            Admin Portal
          </button>
        </div>
      </div>

      {/* Login Card */}
      <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating with JWT...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-indigo-600 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
