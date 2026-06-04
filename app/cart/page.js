'use client';
import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const router = useRouter();

  if (cart.length === 0) return (
    <div className="text-center mt-32 min-h-[50vh]">
      <div className="text-8xl mb-6">🛒</div>
      <h2 className="text-3xl font-bold text-amber-900 mb-4">Your cart is empty</h2>
      <Link href="/" className="bg-amber-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-amber-700 transition">
        Browse Honey
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h1 className="text-4xl font-extrabold text-amber-900 mb-8">Your Cart</h1>
      <div className="space-y-4 mb-8">
        {cart.map(item => (
          <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100 flex items-center gap-6">
            <div className="text-5xl">🍯</div>
            <div className="flex-grow">
              <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
              <p className="text-amber-600 font-semibold">₹{item.price} · {item.weight_g}g</p>
            </div>
            <div className="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden">
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 bg-amber-50 hover:bg-amber-100 font-bold">−</button>
              <span className="px-4 py-2 font-bold">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 bg-amber-50 hover:bg-amber-100 font-bold">+</button>
            </div>
            <p className="text-xl font-black text-amber-900 w-24 text-right">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
            <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 text-2xl font-bold ml-2">×</button>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100">
        <div className="flex justify-between items-center mb-6">
          <span className="text-2xl font-bold text-gray-700">Total</span>
          <span className="text-4xl font-black text-amber-900">₹{total.toFixed(2)}</span>
        </div>
        <button onClick={() => router.push('/checkout')} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-xl py-5 rounded-2xl shadow-lg transition-all">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}
