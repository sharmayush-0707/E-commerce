import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, Save, CheckCircle, Clock, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

export default function ProfilePage() {
  const { user, updateProfile, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' or 'profile'
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const { data } = await orderAPI.getMyOrders();
        setOrders(data || []);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user, navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    const updateData = { name, email };
    if (password) updateData.password = password;

    const res = await updateProfile(updateData);
    if (res.success) {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setPassword('');
    } else {
      setProfileMsg({ type: 'error', text: res.error });
    }
  };

  if (!user) return null;

  return (
    <div className="pb-20 space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-2xl font-black shadow-md shadow-indigo-500/20">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{user.name}</h1>
              {isAdmin && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Admin
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'orders'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            My Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            Profile Settings
          </button>
        </div>
      </div>

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="text-lg font-black text-slate-900 tracking-tight">Order History</h2>

          {ordersLoading ? (
            <div className="py-12 text-center">
              <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-800">No orders placed yet</p>
              <p className="text-xs text-slate-400 mt-1">Start shopping to track your purchases here!</p>
              <Link
                to="/shop"
                className="mt-4 inline-block px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-sm hover:bg-indigo-700"
              >
                Browse Store
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord._id}
                  className="p-6 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[11px] font-mono text-slate-400">Order ID: {ord._id}</span>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                      <span className="text-base font-black text-slate-900">
                        ${ord.totalPrice?.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ord.orderItems?.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50">
                        <img src={it.image} alt="" className="w-12 h-12 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 truncate">{it.name}</p>
                          <p className="text-[11px] text-slate-500">{it.quantity} × ${it.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
                    <span>Payment: <strong className="text-slate-800">{ord.paymentMethod} ({ord.isPaid ? 'Paid' : 'Unpaid'})</strong></span>
                    <span className="text-slate-400">Delivery: {ord.shippingAddress?.city}, {ord.shippingAddress?.country}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Settings Tab */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Account Details</h2>

          {profileMsg && (
            <div className={`p-3.5 rounded-xl text-xs font-semibold ${
              profileMsg.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
            }`}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password (leave blank to keep current)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5" />
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
