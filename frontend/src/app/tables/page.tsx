'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { tableAPI } from '@/lib/api';
import NavigationBar from '@/components/NavigationBar';

interface Table {
  id: number;
  tableNumber: string;
  section: string;
  capacity: number;
  status: string;
}

export default function TablesPage() {
  const router = useRouter();
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showAddTableModal, setShowAddTableModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tableToDelete, setTableToDelete] = useState<Table | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [runningStartTime, setRunningStartTime] = useState<{ [key: number]: number }>({});
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    section: 'AC',
    capacity: 4
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));
    loadTables();
  }, [router]);

  // Update timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getElapsedTime = (table: Table) => {
    if (table.status !== 'RUNNING') return null;
    
    // Get stored start time from localStorage for this specific table
    const storageKey = `table_start_time_${table.id}`;
    let actualStartTime = runningStartTime[table.id];
    
    // Check if we have a stored start time in localStorage
    const storedStartTime = localStorage.getItem(storageKey);
    if (storedStartTime && !runningStartTime[table.id]) {
      actualStartTime = parseInt(storedStartTime);
      setRunningStartTime(prev => ({
        ...prev,
        [table.id]: actualStartTime
      }));
    }
    
    // If no stored time and not already set, initialize it now
    if (!actualStartTime) {
      actualStartTime = currentTime.getTime();
      setRunningStartTime(prev => ({
        ...prev,
        [table.id]: actualStartTime
      }));
      localStorage.setItem(storageKey, actualStartTime.toString());
    }
    
    const runningTime = Math.floor((currentTime.getTime() - actualStartTime) / 1000);
    
    const hours = Math.floor(runningTime / 3600);
    const minutes = Math.floor((runningTime % 3600) / 60);
    const seconds = runningTime % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
  };

  const loadTables = async () => {
    try {
      const response = await tableAPI.getAll();
      setTables(response.data);
    } catch (error) {
      console.error('Failed to load tables:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BLANK':
      case 'AVAILABLE':
        return 'bg-emerald-50 border-emerald-200 hover:border-emerald-400';
      case 'RUNNING':
        return 'bg-orange-50 border-orange-300 hover:border-orange-500';
      case 'PRINTED':
        return 'bg-blue-50 border-blue-200 hover:border-blue-400';
      case 'PAID':
        return 'bg-amber-50 border-amber-200 hover:border-amber-400';
      case 'RUNNING_KOT':
        return 'bg-red-50 border-red-200 hover:border-red-400';
      default:
        return 'bg-stone-100 border-stone-200 hover:border-stone-400';
    }
  };

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case 'BLANK':
      case 'AVAILABLE':
        return 'text-emerald-600';
      case 'RUNNING':
        return 'text-orange-600';
      case 'PRINTED':
        return 'text-blue-600';
      case 'PAID':
        return 'text-amber-600';
      case 'RUNNING_KOT':
        return 'text-red-600';
      default:
        return 'text-stone-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'BLANK':
      case 'AVAILABLE':
        return 'AVAILABLE';
      case 'RUNNING':
        return 'RUNNING';
      case 'PRINTED':
        return 'PRINTED';
      case 'PAID':
        return 'PAID';
      case 'RUNNING_KOT':
        return 'RUNNING KOT';
      default:
        return status;
    }
  };

  const sortTables = (a: Table, b: Table) => {
    const matchA = a.tableNumber.match(/\d+/);
    const matchB = b.tableNumber.match(/\d+/);
    
    const numA = matchA ? parseInt(matchA[0]) : 0;
    const numB = matchB ? parseInt(matchB[0]) : 0;
    
    return numA - numB;
  };

  const filteredTables = useMemo(() => {
    const sectionFiltered = selectedSection === 'ALL'
      ? tables
      : tables.filter(t => t.section === selectedSection);
    return sectionFiltered.sort(sortTables);
  }, [tables, selectedSection]);

  const handleTableClick = (table: Table) => {
    router.push(`/order/${table.id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleAddTable = async () => {
    if (!newTable.tableNumber.trim()) {
      alert('Please enter a table number');
      return;
    }

    try {
      await tableAPI.create(newTable);
      setShowAddTableModal(false);
      setNewTable({ tableNumber: '', section: 'AC', capacity: 4 });
      loadTables(); // Reload tables to show the new one
    } catch (error: any) {
      alert('Failed to add table: ' + (error.response?.data || error.message));
    }
  };

  const handleDeleteTable = async () => {
    if (!tableToDelete) return;

    try {
      await tableAPI.delete(tableToDelete.id);
      setShowDeleteModal(false);
      setTableToDelete(null);
      loadTables(); // Reload tables to reflect the deletion
    } catch (error: any) {
      alert('Failed to delete table: ' + (error.response?.data || error.message));
    }
  };

  const openDeleteModal = (table: Table) => {
    setTableToDelete(table);
    setShowDeleteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F1EB] flex items-center justify-center">
        <div className="text-xl text-stone-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1EB]">
      <NavigationBar
        title="Table Management"
        subtitle="Select a table to create order"
        showBackButton={true}
        backRoute="/dashboard"
        showTableStatus={false}
        showLogout={true}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Section Filter */}
        <div className="mb-8">
          <div className="flex gap-2 flex-wrap">
            {['ALL', 'AC', 'Garden', 'Non-AC'].map((section) => (
              <button
                key={section}
                onClick={() => setSelectedSection(section)}
                className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                  selectedSection === section
                    ? 'bg-[#2D2D2D] text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {section}
              </button>
            ))}
            <button
              onClick={() => setShowAddTableModal(true)}
              className="bg-green-400 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-green-500 transition-all"
            >
              + Add Table
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-900 transition-all"
            >
              🗑️ Delete Table
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8 gap-3">
          {filteredTables.map((table) => (
            <button
              key={table.id}
              onClick={() => handleTableClick(table)}
              className={`aspect-square p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-lg relative ${getStatusColor(table.status)}`}
            >
              <div className="h-full flex flex-col items-center justify-center">
                <div className="text-xl font-bold text-stone-800">{table.tableNumber}</div>
                <div className="text-xs text-stone-500 mt-1">{table.section}</div>
                <div className="text-xs text-stone-600 mt-1 font-medium">Capacity: {table.capacity}</div>
                <div className={`text-xs mt-1 font-semibold uppercase ${getStatusTextColor(table.status)}`}>
                  {getStatusText(table.status)}
                </div>
              </div>
              
              {/* Timer for running tables */}
              {table.status === 'RUNNING' && (
                <div className="absolute top-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1.5 py-0.5 rounded">
                  {getElapsedTime(table)}
                </div>
              )}
            </button>
          ))}
        </div>

        {filteredTables.length === 0 && (
          <div className="text-center py-12 text-stone-500">
            No tables found in this section
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 bg-white rounded-2xl p-6 border border-stone-200">
          <h3 className="font-semibold text-stone-800 mb-4">Status Legend</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-emerald-100 border-2 border-emerald-300"></div>
              <span className="text-sm text-stone-600">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-orange-100 border-2 border-orange-300"></div>
              <span className="text-sm text-stone-600">Running</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-300"></div>
              <span className="text-sm text-stone-600">Printed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-300"></div>
              <span className="text-sm text-stone-600">Paid</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300"></div>
              <span className="text-sm text-stone-600">Running KOT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 py-4 mt-8">
        <div className="container mx-auto px-6 text-center text-sm text-stone-500">
          <p>© 2024 Khanathikana - Restaurant Management System</p>
        </div>
      </footer>

      {/* Add Table Modal */}
      {showAddTableModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Add New Table</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Table Number
                </label>
                <input
                  type="text"
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({...newTable, tableNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-800"
                  placeholder="e.g., AC21, G45"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Section
                </label>
                <select
                  value={newTable.section}
                  onChange={(e) => setNewTable({...newTable, section: e.target.value})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-800"
                >
                  <option value="AC">AC</option>
                  <option value="Garden">Garden</option>
                  <option value="Non-AC">Non-AC</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Capacity
                </label>
                <input
                  type="number"
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({...newTable, capacity: parseInt(e.target.value) || 4})}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-stone-800"
                  min="1"
                  max="20"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowAddTableModal(false);
                  setNewTable({ tableNumber: '', section: 'AC', capacity: 4 });
                }}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTable}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Table Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-stone-800 mb-4">Delete Table</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700 mb-2">
                Select Table to Delete
              </label>
              <select
                value={tableToDelete?.id || ''}
                onChange={(e) => {
                  const table = tables.find(t => t.id === parseInt(e.target.value));
                  setTableToDelete(table || null);
                }}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-stone-800"
              >
                <option value="">Select a table...</option>
                {tables
                  .filter(table => table.status === 'BLANK' || table.status === 'AVAILABLE') // Only allow deletion of available tables
                  .map((table) => (
                    <option key={table.id} value={table.id}>
                      {table.tableNumber} ({table.section}) - Capacity: {table.capacity}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-stone-500 mt-1">
                Only available tables can be deleted. Tables with active orders cannot be removed.
              </p>
            </div>

            {tableToDelete && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> You are about to delete table <strong>{tableToDelete.tableNumber}</strong>.
                  This action cannot be undone.
                </p>
              </div>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setTableToDelete(null);
                }}
                className="flex-1 px-4 py-2 border border-stone-300 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTable}
                disabled={!tableToDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Delete Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
