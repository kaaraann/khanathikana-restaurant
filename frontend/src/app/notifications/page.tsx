'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function NotificationsPage() {
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
        title="Notifications"
        subtitle="Stay updated with restaurant activities"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Notifications Center</h2>
          <div className="text-center py-12 text-stone-400">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="text-lg font-medium">No new notifications</p>
            <p className="text-sm">You're all caught up!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
