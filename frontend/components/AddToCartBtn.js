'use client';
import { useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';

export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isAdded, setIsAdded] = useState(false);

  const handleClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      addToCart(product);
      showToast(`${product.name} added to cart! 🍯`, 'success');

      // Trigger checkmark animation
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    },
    [addToCart, product, showToast]
  );

  return (
    <button
      onClick={handleClick}
      disabled={isAdded}
      className={`
        group relative overflow-hidden
        font-semibold py-2.5 px-6 rounded-xl
        shadow-md transition-all duration-300
        cursor-pointer select-none
        ${
          isAdded
            ? 'bg-green-500 text-white shadow-green-200'
            : 'bg-gradient-to-r from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-lg hover:shadow-amber-200/50 hover:-translate-y-0.5 active:translate-y-0 active:scale-95'
        }
      `}
    >
      {/* Ripple effect on hover */}
      <span className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />

      {/* Content */}
      <span className="relative flex items-center justify-center gap-2">
        {isAdded ? (
          <>
            <svg
              className="w-5 h-5 animate-checkmark"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 10l4 4L16 6" />
            </svg>
            <span>Added!</span>
          </>
        ) : (
          <>
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
              />
            </svg>
            <span>Add to Cart</span>
          </>
        )}
      </span>
    </button>
  );
}