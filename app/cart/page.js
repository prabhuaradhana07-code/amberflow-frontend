'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discount,
    total,
    promoCode,
    applyPromo,
    removePromo,
  } = useCart();
  const router = useRouter();
  const [promoInput, setPromoInput] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setPromoError('');
    setPromoLoading(true);
    try {
      const result = applyPromo(promoInput.trim().toUpperCase());
      if (result === false || (typeof result === 'object' && result?.error)) {
        setPromoError(result?.error || 'Invalid promo code. Try NEW15 for 15% off!');
      } else {
        setPromoInput('');
      }
    } catch {
      setPromoError('Invalid promo code');
    }
    setPromoLoading(false);
  };

  // Calculate values with fallbacks (in case context hasn't been updated yet)
  const calcSubtotal = typeof subtotal === 'number' ? subtotal : cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const calcDiscount = typeof discount === 'number' ? discount : 0;
  const calcTotal = typeof total === 'number' ? total : calcSubtotal - calcDiscount;

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center animate-fade-in-up">
          <div className="text-8xl mb-6 animate-float">🍯</div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-amber-900 mb-3">
            Your cart is empty
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            Looks like you haven&apos;t added any golden goodness yet.
          </p>
          <Link
            href="/#shop"
            className="inline-flex items-center gap-2 bg-amber-600 text-white font-bold px-8 py-4 rounded-full hover:bg-amber-700 transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/50 hover:scale-105"
          >
            Browse Honey
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-6 pt-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-amber-950">
            Your Cart
          </h1>
          <span className="text-sm text-gray-500 bg-amber-100 px-4 py-2 rounded-full font-medium">
            {cart.length} {cart.length === 1 ? 'item' : 'items'}
          </span>
        </div>

        {/* Cart Items */}
        <div className="space-y-4 mb-8">
          {cart.map((item, idx) => (
            <div
              key={item.id}
              className="cart-item bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-amber-100/80 flex items-center gap-4 md:gap-6 animate-fade-in-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
            >
              {/* Icon */}
              <div className="w-16 h-16 md:w-20 md:h-20 bg-amber-100 rounded-2xl flex items-center justify-center shrink-0">
                <span className="text-3xl md:text-4xl">🍯</span>
              </div>

              {/* Info */}
              <div className="flex-grow min-w-0">
                <h3 className="text-lg font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-amber-600 font-semibold text-sm">
                  ₹{item.price} · {item.weight_g}g
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border-2 border-amber-200 rounded-xl overflow-hidden shrink-0">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="w-9 h-9 bg-amber-50 hover:bg-amber-100 font-bold text-lg transition-colors flex items-center justify-center"
                >
                  −
                </button>
                <span className="w-10 h-9 flex items-center justify-center font-bold text-sm bg-white">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="w-9 h-9 bg-amber-50 hover:bg-amber-100 font-bold text-lg transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Line Total */}
              <p className="text-lg font-black text-amber-900 w-20 text-right shrink-0 hidden sm:block">
                ₹{(parseFloat(item.price) * item.quantity).toFixed(0)}
              </p>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-300 hover:text-red-500 text-2xl font-bold transition-colors shrink-0 hover:scale-110"
                title="Remove item"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Promo Code Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-amber-100/80 mb-6">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">Promo Code</h3>
          {promoCode ? (
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-5 py-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-bold text-green-700">{promoCode}</span>
                <span className="text-green-600 text-sm">— 15% OFF applied!</span>
              </div>
              <button
                onClick={removePromo}
                className="text-green-400 hover:text-red-500 font-bold text-xl transition-colors"
              >
                ×
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={promoInput}
                  onChange={(e) => {
                    setPromoInput(e.target.value);
                    setPromoError('');
                  }}
                  placeholder="Enter promo code"
                  className="flex-grow border-2 border-amber-200 rounded-xl px-4 py-3 text-sm font-medium uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !promoInput.trim()}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                  {promoLoading ? '...' : 'Apply'}
                </button>
              </div>
              {promoError && (
                <p className="text-red-500 text-sm mt-2 font-medium">{promoError}</p>
              )}
            </div>
          )}
        </div>

        {/* Price Summary */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-amber-100/80">
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">₹{calcSubtotal.toFixed(2)}</span>
            </div>
            {calcDiscount > 0 && (
              <div className="flex justify-between items-center text-green-600">
                <span className="flex items-center gap-2">
                  Discount
                  {promoCode && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                      {promoCode}
                    </span>
                  )}
                </span>
                <span className="font-semibold">-₹{calcDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-amber-100 pt-4 flex justify-between items-center">
              <span className="text-xl font-bold text-gray-800">Total</span>
              <span className="text-3xl font-black text-amber-900">₹{calcTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-amber-200/50 active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Proceed to Checkout
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>

          <Link
            href="/#shop"
            className="block text-center mt-4 text-amber-600 hover:text-amber-800 font-semibold transition-colors text-sm"
          >
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
