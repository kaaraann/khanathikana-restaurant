'use client';

import { useRouter } from 'next/navigation';

interface NavigationBarProps {
  title?: string;
  subtitle?: string | React.ReactNode;
  status?: string;
  statusColor?: string;
  showBackButton?: boolean;
  backRoute?: string;
  showTableStatus?: boolean;
  showLogout?: boolean;
  onLogout?: () => void;
}

export default function NavigationBar({
  title = '',
  subtitle = '',
  status = '',
  statusColor = 'bg-stone-600',
  showBackButton = true,
  backRoute = '/dashboard',
  showTableStatus = false,
  showLogout = false,
  onLogout
}: NavigationBarProps) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BLANK':
      case 'AVAILABLE':
        return 'bg-emerald-500 text-white';
      case 'RUNNING':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-stone-600 text-white';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'BLANK':
      case 'AVAILABLE':
        return 'AVAILABLE';
      default:
        return status;
    }
  };

  return (
    <header className="bg-[#2D2D2D]/90 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-[#D4A574]/20 h-[72px]">
      <div className="container mx-auto px-6 h-full">
        {/* Main Header */}
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-4">
            {showBackButton && (
              <button 
                onClick={() => router.push(backRoute)}
                className="text-stone-400 hover:text-white transition-colors text-xl min-w-[32px] h-[32px] flex items-center justify-center"
              >
                ←
              </button>
            )}
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              {subtitle && <p className="text-sm text-stone-400">{subtitle}</p>}
            </div>
            {showTableStatus && status && (
              <div className={`px-4 py-2 rounded-lg font-semibold text-sm min-h-[40px] flex items-center ${getStatusColor(status)}`}>
                {getStatusText(status)}
              </div>
            )}
          </div>

          {/* Navigation Icons - Clean Horizontal Layout */}
          <div className="flex items-center gap-2">
            {/* Home */}
            <button 
              onClick={() => router.push('/dashboard')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Dashboard"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </button>

            {/* Tables */}
            <button 
              onClick={() => router.push('/tables')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Table Management"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </button>

            {/* Orders */}
            <button 
              onClick={() => router.push('/orders')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Orders"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </button>

            {/* Customers */}
            <button 
              onClick={() => router.push('/customers')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Customer Management"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            {/* Kitchen */}
            <button 
              onClick={() => router.push('/kitchen')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Kitchen Display"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </button>

            {/* Reports */}
            <button 
              onClick={() => router.push('/reports')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Reports"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>

            {/* Notifications */}
            <button 
              onClick={() => router.push('/notifications')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all relative w-[40px] h-[40px] flex items-center justify-center"
              title="Notifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button 
              onClick={() => router.push('/settings')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Settings"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>

            {/* Help */}
            <button 
              onClick={() => router.push('/help')}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
              title="Help & Support"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {/* Divider */}
            <div className="w-px h-6 bg-stone-600 mx-2"></div>

            {/* Call Support */}
            <button className="flex items-center gap-2 bg-[#D4A574] text-[#2D2D2D] px-4 py-2 rounded-full font-medium hover:bg-[#C49A6C] transition-all shadow-lg hover:shadow-xl h-[40px]">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span className="hidden sm:inline">Support</span>
            </button>

            {/* Logout */}
            {showLogout && onLogout && (
              <button 
                onClick={onLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl h-[40px]"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
