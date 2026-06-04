'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    shipping_name: '', shipping_address: '', shipping_city: '',
    shipping_state: '', shipping_pincode: '', shipping_phone: ''
  });

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (!u) router.push('/login');
    else setUser(JSON.parse(u));
  }, []);

  const handleOrder = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const items = cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify{ ...form, total_amount: total, items })
      };
      const data = await res.json();
      if (data.id) {
        clearCart();
        router.push(`/order-success?id=${data.id}`);
      }
    } catch { alert('Order failed. Try again.'); }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h1 className="text-4xl font-extrabold text-amber-900 mb-8">Checkout</h1>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Details</h2>
        {[
          ['shipping_name', 'Full Name'],
          ['shipping_phone', 'Phone Number'],
          ['shipping_address', 'Address'],
          ['shipping_city', 'City'],
          ['shipping_state', 'State'],
          ['shipping_pincode', 'Pincode']
        ].map(([key, label]) => (
          <input key={key}
            className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500"
            placeholder={label} value={form[key]}
            onChange={e => setForm({ ...form, [key]: e.target.value })} />
        ))}
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
        {cart.map(i => (
          <div key={i.id} className="flex justify-between py-2 border-b border-amber-50">
            <span>{i.name} × {i.quantity}</span>
            <span className="font-bold">₹{(parseFloat(i.price) * i.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 text-xl font-black text-amber-900">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      <button onClick={handleOrder} disabled={loading}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg transition-all">
        {loading ? 'Placing Order...' : 'Place Order (Cash on Delivery)'}
      </button>
    </div>
  );
}