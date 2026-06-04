'use client';
import './globals.css';
import Link from 'next/link';
import { CartProvider, useCart } from './context/CartContext';

function Header() {
  const { count } = useCart();
  return (
    <header className="bg-amber-600 text-white shadow-md sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto p-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-wider flex items-center gap-2">
          <span className="text-3xl">🍯</span> AmberFlow
        </Link>
        <div className="space-x-6 font-medium flex items-center">
          <Link href="/" className="hover:text-amber-200 transition">Shop</Link>
          <Link href="/cart" className="hover:text-amber-200 transition relative">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-4 bg-white text-amber-700 text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link href="/login" className="hover:text-amber-200 transition">Login</Link>
        </div>
      </nav>
    </header>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-amber-50 text-gray-900 min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-grow max-w-6xl mx-auto p-6 w-full">
            {children}
          </main>
          <footer className="bg-amber-900 text-amber-100 text-center p-8 mt-12">
            <p className="text-lg font-bold mb-2">🍯 AmberFlow</p>
            <p className="text-sm opacity-80">© {new Date().getFullYear()} 100% Organic Farm Honey · amberflow.in</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}