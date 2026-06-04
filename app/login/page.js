'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    const url = isLogin ? '/api/auth/login' : '/api/auth/register';
    const body = isLogin ? { email: form.email, password: form.password } : form;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/checkout');
      } else {
        setError(data.error || 'Something went wrong');
      }
    } catch {
      setError('Connection failed');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16">
      <div className="bg-white rounded-3xl shadow-xl border border-amber-100 p-10">
        <div className="text-center mb-8">
          <div className="text-6xl mb-3">🍯</div>
          <h1 className="text-3xl font-extrabold text-amber-900">{isLogin ? 'Welcome Back' : 'Join AmberFlow'}</h1>
        </div>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm font-medium">{error}</div>}
        {!isLogin && (
          <input className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500"
            placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-amber-500"
          placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-amber-500"
          placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold text-lg py-4 rounded-2xl transition-all">
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
        </button>
        <p className="text-center mt-6 text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-amber-600 font-bold hover:underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}