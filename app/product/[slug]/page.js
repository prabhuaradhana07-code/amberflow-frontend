'use client';
import { useCart } from '../../context/CartContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
      .then(r => r.json())
      .then(setProduct);
  }, [slug]);

  if (!product) return <div className="text-center mt-32 text-amber-700 text-xl">Loading...</div>;

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-amber-100 overflow-hidden max-w-5xl mx-auto mt-8 flex flex-col md:flex-row">
      <div className="md:w-1/2 bg-amber-200 flex items-center justify-center min-h-[400px]">
        <span className="text-9xl drop-shadow-lg">🍯</span>
      </div>
      <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
        <div className="text-sm font-black text-amber-600 uppercase tracking-widest mb-3">
          {product.honey_type?.replace('_', ' ')}
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{product.name}</h1>
        <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
        <div className="flex items-end gap-4 mb-8 pb-8 border-b border-amber-200">
          <span className="text-5xl font-black text-amber-900">₹{product.price}</span>
          <span className="text-lg text-gray-400 mb-1">{product.weight_g}g</span>
        </div>
        <div className="flex items-center gap-4 mb-6">
          <label className="font-semibold text-gray-700">Qty:</label>
          <div className="flex items-center border-2 border-amber-300 rounded-xl overflow-hidden">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 bg-amber-100 hover:bg-amber-200 font-bold text-lg">−</button>
            <span className="px-6 py-2 font-bold text-lg">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 bg-amber-100 hover:bg-amber-200 font-bold text-lg">+</button>
          </div>
        </div>
        {product.stock > 0 ? (
          <button onClick={handleAdd} className={`w-full font-bold text-xl py-5 rounded-2xl shadow-lg transition-all ${added ? 'bg-green-500 text-white' : 'bg-amber-600 hover:bg-amber-700 text-white'}`}>
            {added ? '✓ Added to Cart!' : 'Add to Cart'}
          </button>
        ) : (
          <button disabled className="w-full bg-gray-200 text-gray-400 font-bold text-xl py-5 rounded-2xl">Out of Stock</button>
        )}
        <Link href="/" className="text-center mt-4 text-amber-600 hover:underline">← Back to Shop</Link>
      </div>
    </div>
  );
}