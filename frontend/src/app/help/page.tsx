'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function HelpPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <NavigationBar
        title="Help & Support"
        subtitle="FAQs, tutorials, and support resources"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Help Center</h2>
          <div className="text-center py-12 text-stone-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-lg font-medium">Help Documentation</p>
            <p className="text-sm">FAQs, tutorials, and support resources</p>
          </div>
        </div>
      </div>
    </div>
  );
}
