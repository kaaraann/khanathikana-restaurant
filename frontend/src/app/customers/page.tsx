'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function CustomersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    
    // Mock customers - in real app, fetch from API
    setCustomers([
      {
        id: 1,
        name: 'John Doe',
        phone: '+91 98765 43210',
        email: 'john@example.com',
        totalOrders: 15,
        totalSpent: 12500,
        loyaltyPoints: 150,
        joinedDate: '2024-01-15'
      },
      {
        id: 2,
        name: 'Jane Smith',
        phone: '+91 87654 32109',
        email: 'jane@example.com',
        totalOrders: 8,
        totalSpent: 8900,
        loyaltyPoints: 89,
        joinedDate: '2024-02-20'
      },
      {
        id: 3,
        name: 'Bob Johnson',
        phone: '+91 76543 21098',
        email: 'bob@example.com',
        totalOrders: 23,
        totalSpent: 21000,
        loyaltyPoints: 210,
        joinedDate: '2023-12-10'
      }
    ]);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        title="Customer Management"
        subtitle="Manage restaurant customers and loyalty programs"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-stone-200">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search customers by name, phone, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] outline-none"
              />
            </div>
            <button className="px-6 py-2 bg-[#D4A574] text-white rounded-lg hover:bg-[#C49A6C] transition-colors">
              Search
            </button>
            <button className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
              + Add Customer
            </button>
          </div>
        </div>

        {/* Customers List */}
        <div className="bg-white rounded-2xl shadow-lg border border-stone-200">
          <div className="p-6">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Customer Database</h2>
            
            {filteredCustomers.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                No customers found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Contact</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Orders</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Total Spent</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Loyalty Points</th>
                      <th className="text-left py-3 px-4 font-semibold text-stone-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.id} className="border-b border-stone-100 hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium text-stone-800">{customer.name}</p>
                            <p className="text-sm text-stone-500">Joined {customer.joinedDate}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="text-sm text-stone-600">{customer.phone}</p>
                            <p className="text-sm text-stone-500">{customer.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-stone-800">{customer.totalOrders}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium text-[#D4A574]">₹{customer.totalSpent.toLocaleString()}</p>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            {customer.loyaltyPoints} pts
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                              View
                            </button>
                            <button className="text-stone-600 hover:text-stone-800 text-sm font-medium">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
