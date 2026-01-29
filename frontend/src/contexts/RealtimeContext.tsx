'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RealtimeContextType {
  refreshTrigger: number;
  triggerRefresh: () => void;
  lastUpdate: Date;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const triggerRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    setLastUpdate(new Date());
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      triggerRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <RealtimeContext.Provider value={{ refreshTrigger, triggerRefresh, lastUpdate }}>
      {children}
    </RealtimeContext.Provider>
  );
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
}
