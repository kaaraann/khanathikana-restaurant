'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { kitchenAPI, orderAPI } from '@/lib/api';
import NavigationBar from '@/components/NavigationBar';

export default function KitchenPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Fetch real kitchen orders from API
    fetchKitchenOrders();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchKitchenOrders, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(interval);
  }, [router]);

  const fetchKitchenOrders = async () => {
    try {
      setLoading(false);
      let orders = [];
      
      // Try to get kitchen orders first
      try {
        const response = await kitchenAPI.getActiveOrders();
        orders = response.data || [];
      } catch (kitchenError) {
        console.log('Kitchen API not available, falling back to orders API');
        
        // Fallback to regular orders API and filter for active orders
        try {
          const ordersResponse = await orderAPI.getAll();
          const allOrders = ordersResponse.data || [];
          
          // Filter for orders that need kitchen attention
          orders = allOrders.filter((order: any) => {
            // Only show orders that are NOT completed AND NOT paid
            return order.status !== 'COMPLETED' && 
                   order.is_paid !== 1 &&
                   (order.status === 'PENDING' || order.status === 'PREPARING' || order.status === 'RUNNING');
          });
          
          console.log('Kitchen - All orders:', allOrders);
          console.log('Kitchen - Active kitchen orders:', orders);
        } catch (ordersError) {
          console.log('Orders API also not available');
        }
      }
      
      setOrders(orders);
    } catch (error) {
      console.error('Failed to fetch kitchen orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await kitchenAPI.updateOrderStatus(orderId, newStatus);
      // Refresh the orders list
      fetchKitchenOrders();
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'PREPARING': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'READY': return 'bg-green-100 text-green-800 border-green-300';
      case 'COMPLETED': return 'bg-gray-100 text-gray-800 border-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'HIGH' ? 'bg-red-500' : 'bg-stone-400';
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
        title="Kitchen Display System"
        subtitle={
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span>Live</span>
          </div>
        }
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Orders Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12 text-stone-500">
              <div className="text-xl">Loading kitchen orders...</div>
            </div>
          ) : orders.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-stone-200">
              <div className="text-stone-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl">No active orders</p>
                <p className="text-sm mt-2">New orders will appear here automatically</p>
              </div>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl shadow-lg border-2 border-stone-200 overflow-hidden">
                {/* Order Header */}
                <div className={`p-4 border-b ${getPriorityColor(order.priority)}`}>
                  <div className="flex items-center justify-between text-white">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg">Order #{order.id}</span>
                        <span className="px-2 py-1 bg-white/20 rounded-full text-xs">
                          {order.orderType === 'DINE_IN' ? 'Dine In' : order.orderType === 'DELIVERY' ? 'Delivery' : 'Pick Up'}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">Table {order.tableNumber} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  <h3 className="font-semibold text-stone-800 mb-3">Items:</h3>
                  <div className="space-y-2">
                    {order.items?.map((item: any, index: number) => (
                      <div key={index} className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-stone-700">
                            {item.quantity}x {item.name}
                          </p>
                          {item.notes && (
                            <p className="text-sm text-stone-500 italic">Note: {item.notes}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="p-4 border-t border-stone-200 bg-stone-50">
                  <div className="flex gap-2">
                    {order.status === 'PENDING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'PREPARING')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Start Preparing
                      </button>
                    )}
                    {order.status === 'PREPARING' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'READY')}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                      >
                        Mark Ready
                      </button>
                    )}
                    {order.status === 'READY' && (
                      <button
                        onClick={() => updateOrderStatus(order.id, 'COMPLETED')}
                        className="flex-1 px-3 py-2 bg-stone-600 text-white rounded-lg hover:bg-stone-700 transition-colors text-sm font-medium"
                      >
                        Complete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
