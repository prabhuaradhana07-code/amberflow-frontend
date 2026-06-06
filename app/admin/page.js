'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  confirmed: { label: 'Confirmed', color: 'bg-blue-100 text-blue-700' },
  packed: { label: 'Packed', color: 'bg-amber-100 text-amber-700' },
  shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-700' },
  out_for_delivery: { label: 'Out for Delivery', color: 'bg-orange-100 text-orange-700' },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700' },
};

export default function AdminDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userStr);
    if (user.role !== 'admin') {
      router.push('/');
      return;
    }

    fetchOrders(token);
  }, [router]);

  const fetchOrders = async (token) => {
    try {
      const res = await fetch(`${API_URL}/api/orders/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      showToast('Failed to fetch orders.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdating(orderId);
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to update status', 'error');
      }
    } catch (err) {
      showToast('Network error while updating status', 'error');
    }
    
    setUpdating(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAEF]">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-float">🛡️</div>
          <p className="text-amber-700 text-lg font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingOrders = orders.filter((o) => o.status !== 'delivered');
  const revenue = orders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-4xl">🛡️</span>
                <h1 className="text-3xl md:text-4xl font-serif font-bold">Admin Portal</h1>
              </div>
              <p className="text-gray-400">Manage customer orders and platform statistics securely.</p>
            </div>
            <Link
              href="/"
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 font-semibold px-6 py-3 rounded-xl transition-all self-start md:self-auto"
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Orders</p>
            <p className="text-4xl font-black text-gray-900">{orders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Active (Pending)</p>
            <p className="text-4xl font-black text-amber-600">{pendingOrders.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
            <p className="text-4xl font-black text-green-600">₹{revenue.toFixed(0)}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-amber-100">
            <h2 className="text-2xl font-bold text-gray-900">All Customer Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-amber-50/50 text-amber-900 text-sm uppercase tracking-wide">
                  <th className="p-4 font-bold border-b border-amber-100">Order ID</th>
                  <th className="p-4 font-bold border-b border-amber-100">Customer</th>
                  <th className="p-4 font-bold border-b border-amber-100">Amount</th>
                  <th className="p-4 font-bold border-b border-amber-100">Date</th>
                  <th className="p-4 font-bold border-b border-amber-100">Status</th>
                  <th className="p-4 font-bold border-b border-amber-100">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No orders found on the platform yet.
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => {
                    const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.confirmed;
                    return (
                      <tr key={order.id} className="hover:bg-amber-50/30 transition-colors">
                        <td className="p-4 font-mono font-bold text-gray-700">#{order.id}</td>
                        <td className="p-4">
                          <p className="font-bold text-gray-900">{order.user_name || order.shipping_name}</p>
                          <p className="text-xs text-gray-500">{order.user_email}</p>
                          <p className="text-xs text-gray-400">{order.shipping_city}, {order.shipping_state}</p>
                        </td>
                        <td className="p-4 font-bold text-green-700">₹{parseFloat(order.total).toFixed(0)}</td>
                        <td className="p-4 text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleDateString('en-IN', {
                            month: 'short', day: 'numeric', year: 'numeric'
                          })}
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            disabled={updating === order.id}
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className="text-sm bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 font-medium"
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
