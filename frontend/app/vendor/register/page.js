'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/components/Toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function VendorRegisterPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    aadhaar_number: '',
    pan_number: '',
  });

  const [aadhaarDoc, setAadhaarDoc] = useState(null);
  const [panDoc, setPanDoc] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const submitData = new FormData();
    Object.keys(formData).forEach((key) => {
      submitData.append(key, formData[key]);
    });
    
    if (aadhaarDoc) submitData.append('aadhaar_doc', aadhaarDoc);
    if (panDoc) submitData.append('pan_doc', panDoc);

    try {
      const res = await fetch(`${API_URL}/api/auth/register-vendor`, {
        method: 'POST',
        body: submitData,
      });

      if (res.ok) {
        showToast('Vendor registration successful! Please wait for admin approval.', 'success');
        router.push('/login');
      } else {
        const data = await res.json();
        showToast(data.error || 'Registration failed.', 'error');
      }
    } catch (err) {
      showToast('Network error during registration.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#FFFAEF] min-h-screen pb-20 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-3xl">
        <h2 className="mt-6 text-center text-4xl font-serif font-black text-amber-900">
          Become a Vendor 🐝
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join AmberFlow and start selling your premium honey.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-3xl">
        <div className="bg-white py-8 px-6 shadow-2xl sm:rounded-3xl sm:px-10 border border-amber-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div>
                <label className="block text-sm font-bold text-gray-700">Full Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Email address</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Password</label>
                <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Phone</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700">Street Address</label>
                <input required type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">City</label>
                <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">State</label>
                <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Pincode</label>
                <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>

              {/* Documents */}
              <div className="md:col-span-2 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-bold text-amber-900 mb-4">Verification Documents</h3>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Aadhaar Number</label>
                <input required type="text" value={formData.aadhaar_number} onChange={e => setFormData({...formData, aadhaar_number: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Upload Aadhaar (PDF/Image)</label>
                <input required type="file" accept="image/*,application/pdf" onChange={e => setAadhaarDoc(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">PAN Number</label>
                <input required type="text" value={formData.pan_number} onChange={e => setFormData({...formData, pan_number: e.target.value})} className="mt-1 block w-full rounded-xl border-2 border-amber-100 px-4 py-3 shadow-sm focus:border-amber-500 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700">Upload PAN (PDF/Image)</label>
                <input required type="file" accept="image/*,application/pdf" onChange={e => setPanDoc(e.target.files[0])} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-amber-600 hover:bg-amber-700 hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Register as Vendor'}
              </button>
            </div>
            <div className="text-center text-sm">
              <span className="text-gray-500">Already have an account? </span>
              <Link href="/login" className="font-bold text-amber-600 hover:text-amber-500">
                Log in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
