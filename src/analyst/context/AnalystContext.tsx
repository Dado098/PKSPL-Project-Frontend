import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AnalystDashboardData, AnalystUser } from '../types/analystDashboard';
import { analystDashboardService } from '../services/analystDashboardService';
import { DEFAULT_ANALYST_USER } from '../mock/analystDashboardMock';
import { useAuth } from '../../contexts/AuthContext';

export type DemoStateMode = 'normal' | 'loading' | 'empty' | 'error';

interface AnalystContextValue {
  user: AnalystUser;
  dashboardData: AnalystDashboardData | null;
  isLoading: boolean;
  errorMessage: string | null;
  demoState: DemoStateMode;
  setDemoState: (mode: DemoStateMode) => void;
  refreshData: () => Promise<void>;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AnalystContext = createContext<AnalystContextValue | undefined>(undefined);

export const AnalystProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const authUser = auth?.user;
  const [user, setUser] = useState<AnalystUser>(DEFAULT_ANALYST_USER);
  const [dashboardData, setDashboardData] = useState<AnalystDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [demoState, setDemoState] = useState<DemoStateMode>('normal');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Load user profile from AuthContext or fallback to service
  useEffect(() => {
    if (authUser) {
      setUser({
        id: String(authUser.id || authUser.id_user || DEFAULT_ANALYST_USER.id),
        name: authUser.nama || authUser.name || DEFAULT_ANALYST_USER.name,
        email: authUser.email || DEFAULT_ANALYST_USER.email,
        role: authUser.role?.nama_role || (typeof authUser.role === 'string' ? authUser.role : DEFAULT_ANALYST_USER.role),
        avatar: authUser.avatar || undefined,
      });
    } else {
      analystDashboardService.getAuthenticatedUser().then(setUser);
    }
  }, [authUser]);

  // Fetch dashboard data based on demoState mode
  const fetchDashboard = useCallback(async (mode: DemoStateMode) => {
    setIsLoading(true);
    setErrorMessage(null);

    if (mode === 'loading') {
      // Keep loading indefinitely until mode changes
      return;
    }

    try {
      const data = await analystDashboardService.getDashboardSummary({
        simulateDelayMs: 400,
        simulateError: mode === 'error',
        simulateEmpty: mode === 'empty'
      });
      setDashboardData(data);
      setIsLoading(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Gagal memuat data dashboard.');
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard(demoState);
  }, [demoState, fetchDashboard]);

  const refreshData = async () => {
    await fetchDashboard(demoState);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => !prev);
  };

  return (
    <AnalystContext.Provider
      value={{
        user,
        dashboardData,
        isLoading,
        errorMessage,
        demoState,
        setDemoState,
        refreshData,
        sidebarCollapsed,
        toggleSidebar,
        mobileMenuOpen,
        setMobileMenuOpen
      }}
    >
      {children}
    </AnalystContext.Provider>
  );
};

export const useAnalyst = (): AnalystContextValue => {
  const context = useContext(AnalystContext);
  if (!context) {
    throw new Error('useAnalyst must be used within an AnalystProvider');
  }
  return context;
};
