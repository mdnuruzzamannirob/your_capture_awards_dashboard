'use client';

import { createContext, useState, ReactNode } from 'react';

interface DashboardContextType {
  isSidebarVisible: boolean;
  setIsSidebarVisible: (val: boolean) => void;
}

export const DashboardContext = createContext<DashboardContextType | null>(null);

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const value: DashboardContextType = {
    isSidebarVisible,
    setIsSidebarVisible,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
