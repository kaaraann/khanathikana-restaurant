'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [selectedReport, setSelectedReport] = useState('sales');

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
        title="Reports & Analytics"
        subtitle="View business insights and analytics"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Report Type Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Select Report Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'sales', label: 'Sales Report', icon: '💰' },
              { id: 'inventory', label: 'Inventory', icon: '📦' },
              { id: 'staff', label: 'Staff Performance', icon: '👥' },
              { id: 'customers', label: 'Customer Analytics', icon: '📊' }
            ].map((report) => (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-4 rounded-xl border-2 transition-all ${
                  selectedReport === report.id
                    ? 'border-[#D4A574] bg-[#D4A574]/10'
                    : 'border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="text-2xl mb-2">{report.icon}</div>
                <p className="text-sm font-medium text-stone-700">{report.label}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
          {selectedReport === 'sales' && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-6">Sales Report</h2>
              
              {/* Date Range Selector */}
              <div className="flex gap-4 mb-6">
                <select className="px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none">
                  <option>Last 7 Days</option>
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>Custom Range</option>
                </select>
                <button className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#C49A6C] transition-colors">
                  Generate Report
                </button>
              </div>

              {/* Sales Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-sm text-stone-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-bold text-stone-800">₹125,680</p>
                  <p className="text-sm text-green-600">↑ 12% from last period</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-sm text-stone-600 mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-stone-800">342</p>
                  <p className="text-sm text-green-600">↑ 8% from last period</p>
                </div>
                <div className="bg-stone-50 rounded-xl p-4">
                  <p className="text-sm text-stone-600 mb-1">Average Order Value</p>
                  <p className="text-2xl font-bold text-stone-800">₹367</p>
                  <p className="text-sm text-red-600">↓ 3% from last period</p>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-stone-50 rounded-xl p-8 text-center">
                <div className="text-stone-400">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p className="text-lg font-medium">Sales Chart</p>
                  <p className="text-sm">Chart visualization would be displayed here</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'inventory' && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-6">Inventory Report</h2>
              <div className="text-center py-12 text-stone-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <p className="text-lg font-medium">Inventory Management</p>
                <p className="text-sm">Stock levels and reorder points</p>
              </div>
            </div>
          )}

          {selectedReport === 'staff' && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-6">Staff Performance</h2>
              <div className="text-center py-12 text-stone-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium">Staff Analytics</p>
                <p className="text-sm">Performance metrics and productivity</p>
              </div>
            </div>
          )}

          {selectedReport === 'customers' && (
            <div>
              <h2 className="text-xl font-bold text-stone-800 mb-6">Customer Analytics</h2>
              <div className="text-center py-12 text-stone-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <p className="text-lg font-medium">Customer Insights</p>
                <p className="text-sm">Customer behavior and preferences</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
