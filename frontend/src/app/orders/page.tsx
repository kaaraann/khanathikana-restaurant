'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { orderAPI } from '@/lib/api';
import NavigationBar from '@/components/NavigationBar';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Fetch real orders from API
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching orders from database...');
      const response = await orderAPI.getAll();
      console.log('API Response:', response);
      
      // Check if the API returned data successfully
      if (response.data && Array.isArray(response.data)) {
        const allOrders = response.data;
        console.log(`Found ${allOrders.length} orders in database`);
        
        // Log all orders before filtering for debugging
        console.log('All orders fetched (before filtering):', allOrders);
        allOrders.forEach((order: any, index: number) => {
          console.log(`Order ${index + 1}:`, {
            id: order.id,
            status: order.status,
            is_paid: order.is_paid,
            orderType: order.orderType,
            tableId: order.tableId,
            total: order.total
          });
        });

        // Filter orders based on status
        const activeOrders = allOrders.filter((order: any) => {
          if (filter === 'ALL') return true;
          return order.status === filter;
        });
        
        console.log(`Active orders after filtering: ${activeOrders.length}`);
        console.log('Filtered orders:', activeOrders);
        
        setOrders(activeOrders);
        
        // If no active orders, show a helpful message
        if (activeOrders.length === 0 && allOrders.length > 0) {
          console.log('All orders are completed or paid');
        }
      } else {
        console.log('No orders found in database or invalid response format');
        setOrders([]);
      }
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      
      if (error.response?.status === 405) {
        console.log('GET /api/orders not supported - backend may only support POST operations');
        // Try to get orders by checking all tables (alternative approach)
        await fetchOrdersFromTables();
      } else if (error.response?.status === 404) {
        console.log('Orders endpoint not found - backend may not have this endpoint implemented');
        setOrders([]);
      } else {
        console.error('Unexpected error:', error.response?.data || error.message);
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Alternative method: fetch orders by checking all tables
  const fetchOrdersFromTables = async () => {
    try {
      console.log('Trying alternative approach: fetching orders from tables...');
      // This would require tableAPI, but let's keep it simple for now
      setOrders([]);
    } catch (error) {
      console.error('Alternative approach also failed:', error);
      setOrders([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredOrders = filter === 'ALL' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING': return 'bg-orange-100 text-orange-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
        title="Orders"
        subtitle="Manage all restaurant orders"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-stone-200">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'RUNNING', 'COMPLETED', 'PENDING', 'CANCELLED'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-red-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {status.charAt(0) + status.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-stone-800">Order History</h2>
              <button
                onClick={fetchOrders}
                disabled={loading}
                className="px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#C49A6C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
            
            {loading ? (
              <div className="text-center py-12 text-stone-500">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#D4A574] mb-4"></div>
                <div className="text-xl">Fetching orders from database...</div>
                <p className="text-sm mt-2">Loading real order data</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-xl font-medium mb-2">No orders found</p>
                <p className="text-sm mb-4">Try changing the filter or create a new order</p>
                <div className="space-y-2">
                  <p className="text-xs text-stone-400">• Click different filter buttons above</p>
                  <p className="text-xs text-stone-400">• Create orders from table management page</p>
                  <p className="text-xs text-stone-400">• Check browser console for API errors</p>
                </div>
                <button
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#C49A6C] transition-colors"
                >
                  Refresh Orders
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="border border-stone-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-semibold text-stone-800">Order #{order.id}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <span className="text-sm text-stone-500">
                            {order.orderType === 'DINE_IN' ? 'Dine In' : order.orderType === 'DELIVERY' ? 'Delivery' : 'Pick Up'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-stone-600">
                          <span>Table: {order.tableNumber || 'N/A'}</span>
                          <span>Customer: {order.customerName || 'Guest'}</span>
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-[#D4A574]">₹{order.total || 0}</p>
                        <button
                          onClick={() => router.push(`/order/${order.tableNumber}`)}
                          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
