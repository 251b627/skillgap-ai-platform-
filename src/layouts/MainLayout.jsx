import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Navbar } from '../components/layout/Navbar';
import { ToastContainer } from '../components/common/ToastContainer';
import { cn } from '../utils/cn';

export const MainLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Dynamic Navigation */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onMobileClose={() => setIsMobileOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      <Navbar
        onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
        isSidebarCollapsed={isCollapsed}
      />

      {/* Main Content Area */}
      <main
        className={cn(
          'pt-20 pb-12 px-4 sm:px-8 transition-all duration-300 min-h-screen',
          isCollapsed ? 'md:ml-20' : 'md:ml-64'
        )}
      >
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Global Floating Toasts */}
      <ToastContainer />
    </div>
  );
};
