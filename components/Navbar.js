"use client";
import Link from 'next/link';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { getCartCount } = useCart();

  return (
    <nav className="bg-amber-600 text-white p-4 flex justify-between items-center px-8 shadow-md sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold flex items-center gap-2">
        <span>🍯</span> AmberFlow
      </Link>
      <div className="flex gap-6 font-medium">
        <Link href="/" className="hover:text-amber-200 transition-colors">Shop</Link>
        <Link href="/cart" className="hover:text-amber-200 transition-colors">
          Cart ({getCartCount()})
        </Link>
        <Link href="/login" className="hover:text-amber-200 transition-colors">Login</Link>
      </div>
    </nav>
  );
}