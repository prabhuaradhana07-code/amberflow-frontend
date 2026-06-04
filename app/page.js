'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(r => r.json())
      .then(setProducts);
  }, []);

  return (
    <div>
      <div className="text-center mb-16 mt-8">
        <h1 className="text-5xl md:text-6xl font-extrabold text-amber-900 mb-6 tracking-tight">Pure Nature, Bottled.</h1>
        <p className="text-lg text-amber-800 max-w-2xl mx-auto leading-relaxed">
          Experience the rich flavors of our organic, sustainably harvested honey — straight from Indian farms to your table.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
          <Link href={`/product/${product.slug}`} key={product.id} className="group">
            <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform group-hover:-translate-y-2">
              <div className="h-56 bg-amber-200 flex items-center justify-center group-hover:bg-amber-300 transition-colors">
                <span className="text-6xl">🍯</span>
              </div>
              <div className="p-6">
                <div className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-2">
                  {product.honey_type?.replace('_', ' ')}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
                <div className="flex justify-between items-center mt-6">
                  <span className="text-2xl font-extrabold text-amber-900">₹{product.price}</span>
                  <span className="text-sm font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">{product.weight_g}g</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}