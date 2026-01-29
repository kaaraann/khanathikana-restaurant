'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ResponsiveNavigationBarProps {
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

export default function ResponsiveNavigationBar({
  title = '',
  subtitle = '',
  status = '',
  statusColor = 'bg-stone-600',
  showBackButton = true,
  backRoute = '/dashboard',
  showTableStatus = false,
  showLogout = false,
  onLogout
}: ResponsiveNavigationBarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const navigationItems = [
    {
      name: 'Dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      route: '/dashboard'
    },
    {
      name: 'Tables',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      route: '/tables'
    },
    {
      name: 'Orders',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      route: '/orders'
    },
    {
      name: 'Customers',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      route: '/customers'
    },
    {
      name: 'Kitchen',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      route: '/kitchen'
    },
    {
      name: 'Reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      route: '/reports'
    },
    {
      name: 'Notifications',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      route: '/notifications',
      hasBadge: true
    },
    {
      name: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      route: '/settings'
    },
    {
      name: 'Help',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      route: '/help'
    }
  ];

  return (
    <>
      {/* Responsive Header */}
      <header className="bg-[#2D2D2D]/90 backdrop-blur-xl text-white sticky top-0 z-50 border-b border-[#D4A574]/20">
        <div className="container mx-auto px-4 sm:px-6 h-full">
          <div className="flex items-center justify-between h-full py-3 sm:py-4">
            {/* Left Section */}
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center"
                aria-label="Toggle mobile menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>

              {showBackButton && (
                <button 
                  onClick={() => router.push(backRoute)}
                  className="hidden sm:flex text-stone-400 hover:text-white transition-colors text-xl min-w-[32px] h-[32px] items-center justify-center"
                >
                  ←
                </button>
              )}

              {/* Title Section */}
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-2xl font-semibold truncate">{title}</h1>
                {subtitle && <p className="text-xs sm:text-sm text-stone-400 truncate">{subtitle}</p>}
              </div>

              {showTableStatus && status && (
                <div className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm min-h-[32px] sm:min-h-[40px] flex items-center ${getStatusColor(status)}`}>
                  {getStatusText(status)}
                </div>
              )}
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigationItems.slice(0, 6).map((item) => (
                <button 
                  key={item.name}
                  onClick={() => router.push(item.route)}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center relative group"
                  title={item.name}
                >
                  {item.icon}
                  {item.hasBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-stone-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.name}
                  </span>
                </button>
              ))}

              {/* More Menu */}
              <div className="relative group">
                <button className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[40px] h-[40px] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-stone-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {navigationItems.slice(6).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.route)}
                      className="w-full text-left px-4 py-3 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {item.hasBadge && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-px h-6 bg-stone-600 mx-2"></div>

              <button className="flex items-center gap-2 bg-[#D4A574] text-[#2D2D2D] px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-[#C49A6C] transition-all shadow-lg hover:shadow-xl h-[40px]">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="hidden sm:inline">Support</span>
              </button>

              {showLogout && onLogout && (
                <button 
                  onClick={onLogout}
                  className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-full font-medium hover:bg-red-700 transition-all shadow-lg hover:shadow-xl h-[40px]"
                >
                  Logout
                </button>
              )}
            </div>

            {/* Tablet Navigation */}
            <div className="hidden md:flex lg:hidden items-center gap-1">
              {navigationItems.slice(0, 5).map((item) => (
                <button 
                  key={item.name}
                  onClick={() => router.push(item.route)}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[36px] h-[36px] flex items-center justify-center relative"
                  title={item.name}
                >
                  {item.icon}
                  {item.hasBadge && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
              ))}

              <div className="relative group">
                <button className="p-2 text-stone-400 hover:text-white hover:bg-stone-700 rounded-lg transition-all w-[36px] h-[36px] flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-stone-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {navigationItems.slice(5).map((item) => (
                    <button
                      key={item.name}
                      onClick={() => router.push(item.route)}
                      className="w-full text-left px-4 py-3 text-stone-300 hover:text-white hover:bg-stone-700 transition-colors flex items-center gap-3 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {item.hasBadge && (
                        <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex md:hidden items-center gap-2">
              <button className="bg-[#D4A574] text-[#2D2D2D] p-2 rounded-full hover:bg-[#C49A6C] transition-all shadow-lg w-[36px] h-[36px] flex items-center justify-center">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#2D2D2D] shadow-2xl z-50 transform transition-transform duration-300 lg:hidden">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b border-stone-700">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-stone-400 hover:text-white rounded-lg transition-all"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h2 className="text-lg font-semibold">Menu</h2>
                </div>
              </div>

              <nav className="flex-1 overflow-y-auto p-4">
                <div className="space-y-1">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        router.push(item.route);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-stone-300 hover:text-white hover:bg-stone-700 rounded-lg transition-all flex items-center gap-3 group"
                    >
                      <div className="w-10 h-10 flex items-center justify-center bg-stone-800 group-hover:bg-stone-600 rounded-lg transition-colors">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.name}</div>
                        {item.hasBadge && (
                          <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                            <span className="text-xs text-stone-400">New notifications</span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="my-6 border-t border-stone-700"></div>

                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-3 bg-[#D4A574] text-[#2D2D2D] rounded-lg font-medium hover:bg-[#C49A6C] transition-all flex items-center gap-3">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span>Call Support</span>
                  </button>

                  {showLogout && onLogout && (
                    <button 
                      onClick={() => {
                        onLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-all flex items-center gap-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Logout</span>
                    </button>
                  )}
                </div>
              </nav>

              <div className="p-4 border-t border-stone-700">
                <div className="text-xs text-stone-500 text-center">
                  <p>Khanathikana Restaurant</p>
                  <p>Management System v1.0</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
