import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';

export const DashboardLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-cream">
      {/* Mobile topbar — hidden on lg+, where the sidebar is always visible */}
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center justify-between bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 64 64" className="h-7 w-7">
            <circle cx="32" cy="40" r="14" fill="#FF6B4A" />
            <circle cx="14" cy="22" r="7" fill="#FF6B4A" />
            <circle cx="32" cy="12" r="7.5" fill="#FF6B4A" />
            <circle cx="50" cy="22" r="7" fill="#FF6B4A" />
          </svg>
          <span className="font-display text-lg font-bold text-ink">PawfectCare</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open menu"
          className="rounded-xl p-2 text-ink hover:bg-cream"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <Sidebar isMobileOpen={isMobileSidebarOpen} onMobileClose={() => setIsMobileSidebarOpen(false)} />

      <main className="w-full flex-1 overflow-y-auto px-4 py-6 pt-20 lg:px-8 lg:py-8 lg:pt-8">
        <Outlet />
      </main>
    </div>
  );
};