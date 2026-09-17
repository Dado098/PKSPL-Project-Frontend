import React from 'react';
import { Outlet } from 'react-router-dom';
import { AnalystSidebar } from './AnalystSidebar';
import { AnalystTopbar } from './AnalystTopbar';
import { useAnalyst } from '../../context/AnalystContext';

export const AnalystAppShell: React.FC = () => {
  const { mobileMenuOpen, setMobileMenuOpen } = useAnalyst();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      {/* Desktop Persistent Sidebar */}
      <div className="hidden md:block">
        <AnalystSidebar />
      </div>

      {/* Mobile Drawer Backdrop & Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 shadow-xl z-10">
            <AnalystSidebar isMobile={true} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AnalystTopbar />

        <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
