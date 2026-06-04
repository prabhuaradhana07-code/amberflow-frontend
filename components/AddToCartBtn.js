"use client";
import { useCart } from '../context/CartContext';

export default function AddToCartBtn({ product }) {
  const { addToCart } = useCart();

  return (
    <button 
      onClick={(e) => {
        e.preventDefault(); // Stops the page from jumping to the product detail link
        addToCart(product);
      }}
      className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-xl shadow-md transition-all duration-300 active:scale-95"
    >
      Add to Cart
    </button>
  );
}