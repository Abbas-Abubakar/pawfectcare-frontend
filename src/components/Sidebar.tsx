import { NavLink } from 'react-router-dom';
import { navigationByRole } from '@/config/navigation';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth.api';

export const Sidebar = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  if (!user) return null;

  const navItems = navigationByRole[user.role];

  const handleLogout = async () => {
    await authApi.logout();
    logout();
    window.location.href = '/auth/login';
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-white px-4 py-6">
      <div className="flex items-center gap-2 px-2">
        <svg viewBox="0 0 64 64" className="h-8 w-8">
          <circle cx="32" cy="40" r="14" fill="#FF6B4A" />
          <circle cx="14" cy="22" r="7" fill="#FF6B4A" />
          <circle cx="32" cy="12" r="7.5" fill="#FF6B4A" />
          <circle cx="50" cy="22" r="7" fill="#FF6B4A" />
        </svg>
        <span className="font-display text-xl font-bold text-ink">PawfectCare</span>
      </div>

      <nav className="mt-10 flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '.'}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-coral-light text-coral-dark'
                  : 'text-ink/60 hover:bg-cream hover:text-ink'
              }`
            }
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-ink/10 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sunshine font-display font-bold text-ink">
            {user.name.charAt(0).toUpperCase()}
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
    </aside>
  );
};