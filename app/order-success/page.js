'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get('id');
  return (
    <div className="text-center mt-24 min-h-[60vh]">
      <div className="text-8xl mb-6">🎉</div>
      <h1 className="text-4xl font-extrabold text-amber-900 mb-4">Order Placed Successfully!</h1>
      <p className="text-gray-600 text-lg mb-2">Thank you for choosing AmberFlow.</p>
      <p className="text-gray-500 mb-8">Order ID: <span className="font-bold text-amber-700">#{id}</span></p>
      <Link href="/" className="bg-amber-600 text-white font-bold px-10 py-4 rounded-2xl hover:bg-amber-700 transition text-lg">
        Continue Shopping
      </Link>
    </div>
  );
}

export default function OrderSuccess() {
  return <Suspense><SuccessContent /></Suspense>;
}