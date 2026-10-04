import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/Sidebar';

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-cream">
      <Sidebar />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
};