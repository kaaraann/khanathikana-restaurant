'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { tableAPI, orderAPI, reportAPI } from '@/lib/api';
import { useRealtime } from '@/contexts/RealtimeContext';
import NavigationBar from '@/components/NavigationBar';

export default function DashboardPage() {
  const router = useRouter();
  const { refreshTrigger } = useRealtime();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    activeTables: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Fetch real data from API
    fetchDashboardData();
  }, [router]);

  // Re-fetch data when realtime trigger changes
  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [refreshTrigger, user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch tables data
      const tablesResponse = await tableAPI.getAll();
      const tables = tablesResponse.data || [];
      
      // Fetch orders data
      let orders = [];
      try {
        const ordersResponse = await orderAPI.getAll();
        orders = ordersResponse.data || [];
      } catch (orderError) {
        console.log('Orders API not available, using tables data only');
      }
      
      // Calculate stats from real data
      const activeTablesCount = tables.filter((table: any) => 
        table.status === 'RUNNING' || table.status === 'PRINTED' || table.status === 'RUNNING_KOT'
      ).length;
      
      const activeOrdersCount = orders.filter((order: any) => {
        // Multiple conditions to filter out completed/paid orders
        const isCompleted = order.status === 'COMPLETED';
        const isPaid = order.is_paid === 1 || order.is_paid === true || order.is_paid === '1';
        const isPaidString = order.is_paid === '1' || order.is_paid === 'true';
        
        console.log(`Dashboard Order ${order.id}: status="${order.status}", is_paid=${order.is_paid} (${typeof order.is_paid}), isCompleted=${isCompleted}, isPaid=${isPaid}`);
        
        // Only count orders that are NOT completed AND NOT paid
        return !isCompleted && !isPaid && !isPaidString;
      }).length;
      
      console.log('Dashboard - All orders:', orders);
      console.log('Dashboard - Active orders count:', activeOrdersCount);
      console.log('Dashboard - Completed orders:', orders.filter((o: any) => o.status === 'COMPLETED'));
      console.log('Dashboard - Paid orders:', orders.filter((o: any) => o.is_paid === 1 || o.is_paid === true));
      
      const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total || 0), 0);
      
      setStats({
        totalOrders: orders.length,
        totalRevenue: totalRevenue,
        activeTables: activeTablesCount,
        pendingOrders: activeOrdersCount
      });
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Set fallback values if API fails
      setStats({
        totalOrders: 0,
        totalRevenue: 0,
        activeTables: 0,
        pendingOrders: 0
      });
    } finally {
      setLoading(false);
    }
  };

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
        title="Dashboard"
        subtitle="Restaurant Management Overview"
        showBackButton={false}
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 mb-1">Total Orders</p>
                {loading ? (
                  <div className="text-3xl font-bold text-stone-800">...</div>
                ) : (
                  <p className="text-3xl font-bold text-stone-800">{stats.totalOrders}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 mb-1">Total Revenue</p>
                {loading ? (
                  <div className="text-3xl font-bold text-stone-800">...</div>
                ) : (
                  <p className="text-3xl font-bold text-stone-800">₹{stats.totalRevenue.toLocaleString()}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 mb-1">Active Tables</p>
                {loading ? (
                  <div className="text-3xl font-bold text-stone-800">...</div>
                ) : (
                  <p className="text-3xl font-bold text-stone-800">{stats.activeTables}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-stone-600 mb-1">Pending Orders</p>
                {loading ? (
                  <div className="text-3xl font-bold text-stone-800">...</div>
                ) : (
                  <p className="text-3xl font-bold text-stone-800">{stats.pendingOrders}</p>
                )}
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
          <h2 className="text-xl font-bold text-stone-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/tables')}
              className="p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <p className="text-sm font-medium text-stone-700">Table Management</p>
            </button>

            <button
              onClick={() => router.push('/orders')}
              className="p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm font-medium text-stone-700">View Orders</p>
            </button>

            <button
              onClick={() => router.push('/kitchen')}
              className="p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-sm font-medium text-stone-700">Kitchen Display</p>
            </button>

            <button
              onClick={() => router.push('/reports')}
              className="p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors text-center"
            >
              <svg className="w-8 h-8 mx-auto mb-2 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm font-medium text-stone-700">Reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
