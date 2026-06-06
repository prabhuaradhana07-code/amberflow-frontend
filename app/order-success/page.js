'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function ConfettiPiece({ index }) {
  const colors = ['#f59e0b', '#d97706', '#b45309', '#fbbf24', '#fcd34d', '#92400e', '#78350f'];
  const color = colors[index % colors.length];
  const left = Math.random() * 100;
  const delay = Math.random() * 3;
  const duration = 2 + Math.random() * 3;
  const size = 6 + Math.random() * 8;
  const rotation = Math.random() * 360;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${left}%`,
        top: '-20px',
        width: `${size}px`,
        height: `${size * 0.6}px`,
        backgroundColor: color,
        borderRadius: '2px',
        transform: `rotate(${rotation}deg)`,
        animation: `confettiFall ${duration}s ease-in ${delay}s infinite`,
        opacity: 0,
      }}
    />
  );
}

function SuccessContent() {
  const params = useSearchParams();
  const id = params.get('id');
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Stagger animation
    const timer = setTimeout(() => setShowContent(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FFFAEF] flex items-center justify-center relative overflow-hidden">
      {/* Confetti */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 50 }).map((_, i) => (
          <ConfettiPiece key={i} index={i} />
        ))}
      </div>

      {/* Glowing circles background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center px-6 max-w-lg transition-all duration-700 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Success icon */}
        <div className="relative inline-block mb-8">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto shadow-2xl shadow-green-200/60">
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* Celebrating emojis */}
          <span className="absolute -top-2 -left-4 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎉</span>
          <span className="absolute -top-2 -right-4 text-4xl animate-bounce" style={{ animationDelay: '0.8s' }}>🎊</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-amber-900 mb-4">
          Order Placed Successfully!
        </h1>

        <p className="text-lg text-gray-600 mb-2">
          Thank you for choosing <span className="font-bold text-amber-700">AmberFlow</span> 🍯
        </p>
        <p className="text-gray-500 mb-8">
          Your premium honey is being prepared with care and love.
        </p>

        {id && (
          <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6 mb-8 inline-block">
            <p className="text-sm text-gray-500 mb-1">Order ID</p>
            <p className="text-2xl font-black text-amber-800 font-mono">#{id}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {id && (
            <Link
              href={`/order/${id}`}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-lg"
            >
              📦 Track Your Order
            </Link>
          )}
          <Link
            href="/"
            className="bg-white hover:bg-amber-50 text-amber-700 font-bold px-8 py-4 rounded-2xl transition-all shadow-md border-2 border-amber-200 hover:border-amber-300 text-lg"
          >
            🛒 Continue Shopping
          </Link>
        </div>

        <div className="mt-10 p-4 bg-amber-50 rounded-xl border border-amber-100">
          <p className="text-sm text-amber-700">
            💌 A confirmation email has been sent to your registered email address.
          </p>
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
}

export default function OrderSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FFFAEF]">
          <div className="text-6xl animate-float">🍯</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}