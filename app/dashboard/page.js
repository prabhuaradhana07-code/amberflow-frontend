'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700', icon: '📋' },
  packed: { label: 'Packed', color: 'bg-amber-100 text-amber-700', icon: '📦' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: '🚚' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700', icon: '🏍️' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: '✅' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    const u = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (!u || !token) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(u));

    // Fetch profile and orders
    Promise.all([
      fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
      fetch(`${API_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json()),
    ])
      .then(([profileData, ordersData]) => {
        setProfile(profileData);
        setEditForm({
          name: profileData.name || '',
          phone: profileData.phone || '',
          address: profileData.address || '',
        });
        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [router]);

  const handleSaveProfile = async () => {
    setSaving(true);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        // Update localStorage user
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...storedUser, name: updated.name }));
        setEditing(false);
      }
    } catch { /* silent */ }
    setSaving(false);
  };

  const totalSpent = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
      })
    : '—';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAEF]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🍯</div>
          <p className="text-amber-700 text-lg font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const initials = (profile?.name || user.name || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-600 via-amber-500 to-yellow-500 text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold border-4 border-white/30 shadow-xl">
              {initials}
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">
                {profile?.name || user.name}
              </h1>
              <p className="text-amber-100 text-lg">{profile?.email || user.email}</p>
              {profile?.phone && (
                <p className="text-amber-200 text-sm mt-1">📞 {profile.phone}</p>
              )}
            </div>
            <div className="md:ml-auto">
              <button
                onClick={() => {
                  setEditing(!editing);
                  if (!editing) {
                    setEditForm({
                      name: profile?.name || '',
                      phone: profile?.phone || '',
                      address: profile?.address || '',
                    });
                  }
                }}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold px-6 py-3 rounded-2xl transition-all border border-white/20"
              >
                {editing ? '✕ Cancel' : '✏️ Edit Profile'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-6">
        {/* Edit Profile Form */}
        {editing && (
          <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8 mb-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-amber-900 mb-6">Edit Profile</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Full Name</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-600 mb-2">Phone</label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-600 mb-2">Address</label>
                <textarea
                  value={editForm.address}
                  onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                  rows={3}
                  className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSaveProfile}
                disabled={saving}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-3 rounded-xl transition-all disabled:opacity-50"
              >
                {saving ? 'Saving...' : '💾 Save Changes'}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-8 py-3 rounded-xl transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-2xl">
                📦
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                <p className="text-3xl font-black text-amber-900">{orders.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-2xl">
                💰
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                <p className="text-3xl font-black text-green-700">₹{totalSpent.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center text-2xl">
                🗓️
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Member Since</p>
                <p className="text-lg font-bold text-purple-700">{memberSince}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-200/50'
                : 'bg-white text-gray-600 hover:bg-amber-50 border border-amber-100'
            }`}
          >
            📦 Order History
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-600 text-white shadow-lg shadow-amber-200/50'
                : 'bg-white text-gray-600 hover:bg-amber-50 border border-amber-100'
            }`}
          >
            👤 Profile Details
          </button>
        </div>

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-16 text-center">
                <div className="text-6xl mb-4">🛒</div>
                <h3 className="text-2xl font-bold text-amber-900 mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
                <Link
                  href="/"
                  className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg"
                >
                  Browse Honey 🍯
                </Link>
              </div>
            ) : (
              orders.map((order) => {
                const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
                return (
                  <Link
                    href={`/order/${order.id}`}
                    key={order.id}
                    className="block bg-white rounded-2xl shadow-sm border border-amber-100 p-6 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center gap-4 flex-grow">
                        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl">
                          {status.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 text-lg">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {new Date(order.created_at).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${status.color}`}>
                          {status.label}
                        </span>
                        <div className="text-right">
                          <p className="text-xl font-black text-amber-900">₹{parseFloat(order.total).toFixed(0)}</p>
                          {parseFloat(order.discount) > 0 && (
                            <p className="text-xs text-green-600 font-medium">Saved ₹{parseFloat(order.discount).toFixed(0)}</p>
                          )}
                        </div>
                        <svg
                          className="w-5 h-5 text-gray-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-8">
            <h2 className="text-2xl font-serif font-bold text-amber-900 mb-8">Profile Information</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 bg-amber-50/50 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-amber-600 font-bold mb-1">Full Name</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.name || '—'}</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-amber-600 font-bold mb-1">Email</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.email || '—'}</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-amber-600 font-bold mb-1">Phone</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.phone || 'Not set'}</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl">
                <p className="text-xs uppercase tracking-wider text-amber-600 font-bold mb-1">Member Since</p>
                <p className="text-lg font-semibold text-gray-900">{memberSince}</p>
              </div>
              <div className="p-4 bg-amber-50/50 rounded-xl md:col-span-2">
                <p className="text-xs uppercase tracking-wider text-amber-600 font-bold mb-1">Address</p>
                <p className="text-lg font-semibold text-gray-900">{profile?.address || 'Not set'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
