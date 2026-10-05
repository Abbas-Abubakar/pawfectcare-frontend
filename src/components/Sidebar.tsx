import { NavLink } from 'react-router-dom';
import { navigationByRole } from '@/config/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';
import { useNotifications } from '@/hooks/useNotifications';

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar = ({ isMobileOpen, onMobileClose }: SidebarProps) => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data: notificationsData } = useNotifications();

  if (!user) return null;

  const navItems = navigationByRole[user.role];
  const unreadCount = notificationsData?.unreadCount ?? 0;

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    window.location.href = '/auth/login';
  };

  const sidebarContent = (
    <>
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <svg viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="40" r="14" fill="#FF6B4A" />
            <circle cx="14" cy="22" r="7" fill="#FF6B4A" />
            <circle cx="32" cy="12" r="7.5" fill="#FF6B4A" />
            <circle cx="50" cy="22" r="7" fill="#FF6B4A" />
          </svg>
          <span className="font-display text-xl font-bold text-ink">PawfectCare</span>
        </div>
        {/* Close button — only relevant in the mobile drawer context */}
        <button onClick={onMobileClose} aria-label="Close menu" className="rounded-full p-1 text-ink/40 lg:hidden">
          ✕
        </button>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === "."}
            onClick={onMobileClose}
            className={({ isActive }) =>
              `flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive ? 'bg-coral-light text-coral-dark' : 'text-ink/60 hover:bg-cream hover:text-ink'
              }`
            }
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-coral px-1.5 text-xs font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-sunshine font-display font-bold text-ink">
            {user.profilePhoto?.url ? (
              <img src={user.profilePhoto.url} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
            <p className="truncate text-xs capitalize text-ink/50">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 w-full rounded-2xl px-4 py-2 text-left text-sm font-medium text-ink/60 transition-colors hover:bg-cream hover:text-coral"
        >
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop — always visible, normal document flow */}
      <aside className="hidden h-screen w-64 shrink-0 flex-col bg-white px-4 py-6 lg:flex">
        {sidebarContent}
      </aside>

      {/* Mobile — overlay + slide-in drawer, only in the DOM's visual sense when open */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={onMobileClose} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white px-4 py-6 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};