'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VendorDashboardPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: '', description: '', honey_type: '', price: '', weight_g: '', stock: ''
  });
  const [productImage, setProductImage] = useState(null);
  const [addingProduct, setAddingProduct] = useState(false);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      const u = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      if (!u || !token) {
        router.push('/login');
        return;
      }
      
      const parsedUser = JSON.parse(u);
      if (parsedUser.role !== 'vendor') {
        router.push('/');
        return;
      }

      // Fetch fresh profile to get approval status
      try {
        const profRes = await fetch(`${API_URL}/api/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const profData = await profRes.json();
        setUser(profData);
        
        if (profData.is_approved_vendor) {
          const statRes = await fetch(`${API_URL}/api/orders/vendor-stats`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const statData = await statRes.json();
          setStats(Array.isArray(statData) ? statData : []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchUserAndStats();
  }, [router]);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setAddingProduct(true);
    const token = localStorage.getItem('token');
    
    const fd = new FormData();
    Object.keys(productForm).forEach(k => fd.append(k, productForm[k]));
    if (productImage) fd.append('image', productImage);

    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (res.ok) {
        showToast('Product added successfully!', 'success');
        setProductForm({ name: '', description: '', honey_type: '', price: '', weight_g: '', stock: '' });
        setProductImage(null);
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to add product.', 'error');
      }
    } catch (err) {
      showToast('Network error.', 'error');
    }
    setAddingProduct(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFAEF]">
        <div className="text-center text-6xl animate-float">🐝</div>
      </div>
    );
  }

  if (!user?.is_approved_vendor) {
    return (
      <div className="min-h-screen bg-[#FFFAEF] flex items-center justify-center p-6">
        <div className="bg-white p-12 rounded-3xl shadow-2xl text-center max-w-xl border border-amber-100">
          <div className="text-6xl mb-6">⏳</div>
          <h2 className="text-3xl font-bold text-amber-900 mb-4">Account Pending Approval</h2>
          <p className="text-gray-600 mb-8 text-lg">
            Thank you for registering as a vendor. Our admin team is currently reviewing your Aadhaar and PAN documents. You will be able to access your dashboard and post products once approved.
          </p>
          <Link href="/" className="bg-amber-100 text-amber-800 px-8 py-3 rounded-xl font-bold hover:bg-amber-200 transition-colors">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20">
      <div className="bg-gradient-to-br from-amber-800 to-amber-600 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-6 py-12 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">Vendor Dashboard</h1>
            <p className="text-amber-100">Welcome back, {user.name}!</p>
          </div>
          <Link href="/" className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-6 py-2 rounded-xl font-bold transition-colors">
            Storefront
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 -mt-6">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Sales Insights */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span>📈</span> Sales Insights
              </h3>
              {stats.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No sales data yet.</p>
              ) : (
                <div className="space-y-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="font-bold text-amber-900">{stat.product_name}</p>
                      <div className="flex justify-between mt-2 text-sm font-medium">
                        <span className="text-amber-700">Sold: {stat.total_sold} units</span>
                        <span className="text-green-600">₹{parseFloat(stat.revenue).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Add Product Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-amber-100 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Product</h2>
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Product Name</label>
                    <input required type="text" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Honey Type</label>
                    <select required value={productForm.honey_type} onChange={e => setProductForm({...productForm, honey_type: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 bg-white">
                      <option value="">Select type</option>
                      <option value="Raw">Raw</option>
                      <option value="Organic">Organic</option>
                      <option value="Infused">Infused</option>
                      <option value="Manuka">Manuka</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-gray-700">Description</label>
                    <textarea required rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Price (₹)</label>
                    <input required type="number" min="0" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Weight (g)</label>
                    <input required type="number" min="0" value={productForm.weight_g} onChange={e => setProductForm({...productForm, weight_g: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Initial Stock</label>
                    <input required type="number" min="0" value={productForm.stock} onChange={e => setProductForm({...productForm, stock: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700">Product Image</label>
                    <input required type="file" accept="image/*" onChange={e => setProductImage(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
                  </div>
                </div>
                <button type="submit" disabled={addingProduct} className="w-full py-4 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50">
                  {addingProduct ? 'Adding Product...' : 'Publish Product'}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
