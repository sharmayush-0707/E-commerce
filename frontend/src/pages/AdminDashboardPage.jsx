import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  AlertTriangle,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  Truck,
  Layers,
  X,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';

export default function AdminDashboardPage() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview, products, orders, users
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    category: 'Electronics',
    brand: '',
    stock: 10,
    image: '',
    description: ''
  });

  useEffect(() => {
    if (!user || !isAdmin) {
      return;
    }
    loadAllData();
  }, [user, isAdmin]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [statsRes, prodRes, ordRes, usersRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getProducts(),
        adminAPI.getOrders(),
        adminAPI.getUsers()
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data);
      setOrders(ordRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to load admin metrics', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="py-24 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Admin Privileges Required</h2>
        <p className="text-xs text-slate-500 mt-2">
          You must be signed in with an administrator account to view the inventory dashboard.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs"
        >
          Sign in as Admin
        </button>
      </div>
    );
  }

  // Handle Product Create / Update
  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setProductFormData({
      name: '',
      price: '',
      originalPrice: '',
      category: 'Electronics',
      brand: '',
      stock: 15,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      description: ''
    });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (prod) => {
    setEditingProduct(prod);
    setProductFormData({
      name: prod.name,
      price: prod.price,
      originalPrice: prod.originalPrice || prod.price,
      category: prod.category,
      brand: prod.brand,
      stock: prod.stock,
      image: prod.image,
      description: prod.description
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct._id, productFormData);
      } else {
        await adminAPI.createProduct(productFormData);
      }
      setIsProductModalOpen(false);
      loadAllData();
    } catch (err) {
      alert('Error saving product: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await adminAPI.deleteProduct(id);
      loadAllData();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleUpdateStock = async (id, newStock) => {
    try {
      await adminAPI.updateProduct(id, { stock: Number(newStock) });
      loadAllData();
    } catch (err) {
      alert('Failed to update stock level');
    }
  };

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminAPI.updateOrderStatus(orderId, status);
      loadAllData();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminAPI.updateUserRole(userId, nextRole);
      loadAllData();
    } catch (err) {
      alert('Failed to update user role');
    }
  };

  return (
    <div className="pb-20 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
            Admin Inventory Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1.5">
            Store Management
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold flex items-center gap-1.5 shadow-xs"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Revenue</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                ${stats.summary?.totalRevenue?.toFixed(2)}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Customer Orders</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {stats.summary?.totalOrders}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Products</p>
              <h3 className="text-xl font-black text-slate-900 mt-0.5">
                {stats.summary?.totalProducts}
              </h3>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">Low Stock Alerts</p>
              <h3 className="text-xl font-black text-rose-600 mt-0.5">
                {stats.summary?.lowStockCount} items
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Dashboard Overview', icon: Layers },
          { id: 'products', label: `Inventory & Products (${products.length})`, icon: Package },
          { id: 'orders', label: `Customer Orders (${orders.length})`, icon: ShoppingBag },
          { id: 'users', label: `Users & Roles (${users.length})`, icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && stats && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Low Stock Alerts */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Low Stock Threshold Alerts (&le; 10 units)
              </h3>
            </div>

            <div className="space-y-3">
              {stats.lowStockProducts?.map((p) => (
                <div key={p._id} className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-400">{p.category} • ${p.price}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-extrabold text-rose-600 bg-rose-100 px-2 py-0.5 rounded">
                      {p.stock} left
                    </span>
                    <button
                      onClick={() => handleUpdateStock(p._id, p.stock + 20)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold"
                    >
                      +20 Refill
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sales Breakdown by Category */}
          <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100">
              Category Sales Volume
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.categorySales || {}).map(([cat, amount]) => (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{cat}</span>
                    <span className="text-slate-900">${amount.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{
                        width: `${Math.min(100, (amount / (stats.summary.totalRevenue || 1)) * 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Products Inventory */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Store Inventory Items</h3>
            <span className="text-xs text-slate-400">Manage pricing, stocks, and catalog details</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Product</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3">Stock Units</th>
                  <th className="px-5 py-3">Rating</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover shrink-0 bg-slate-100" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate max-w-xs">{p.name}</p>
                        <p className="text-[11px] text-slate-400">{p.brand}</p>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-medium">{p.category}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-900">${p.price}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold px-2 py-0.5 rounded ${
                          p.stock <= 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {p.stock}
                        </span>
                        <button
                          onClick={() => handleUpdateStock(p._id, p.stock + 10)}
                          className="text-[10px] font-bold text-indigo-600 hover:underline"
                        >
                          +10
                        </button>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-amber-600">{p.rating} ★</td>
                    <td className="px-5 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-indigo-600 transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p._id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Orders */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">All Customer Orders</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">Order ID</th>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Items</th>
                  <th className="px-5 py-3">Total</th>
                  <th className="px-5 py-3">Payment</th>
                  <th className="px-5 py-3">Fulfillment Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-mono text-[11px] font-bold text-slate-900">{o._id}</td>
                    <td className="px-5 py-3.5">
                      <p className="font-bold text-slate-900">{o.customerName || 'Customer'}</p>
                      <p className="text-[11px] text-slate-400">{o.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">{o.orderItems?.length || 0} items</td>
                    <td className="px-5 py-3.5 font-black text-slate-900">${o.totalPrice?.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        o.isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {o.isPaid ? 'Paid' : 'Unpaid'} ({o.paymentMethod})
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={o.status}
                        onChange={(e) => handleUpdateOrderStatus(o._id, e.target.value)}
                        className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Users Management */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Registered Accounts</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Registered At</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5 font-bold text-slate-900">{u.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{u.email}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleToggleUserRole(u._id, u.role)}
                        className="text-xs font-bold text-indigo-600 hover:underline"
                      >
                        {u.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Product Title</label>
                <input
                  type="text"
                  value={productFormData.name}
                  onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                  placeholder="e.g. Sony WH-1000XM5 Headphones"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.price}
                    onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={productFormData.originalPrice}
                    onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={productFormData.category}
                    onChange={(e) => setProductFormData({ ...productFormData, category: e.target.value })}
                    placeholder="Electronics, Wearables, Fashion..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brand</label>
                  <input
                    type="text"
                    value={productFormData.brand}
                    onChange={(e) => setProductFormData({ ...productFormData, brand: e.target.value })}
                    placeholder="Sony, Apple, Nike..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stock Count</label>
                <input
                  type="number"
                  value={productFormData.stock}
                  onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={productFormData.image}
                  onChange={(e) => setProductFormData({ ...productFormData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productFormData.description}
                  onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-sm"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
