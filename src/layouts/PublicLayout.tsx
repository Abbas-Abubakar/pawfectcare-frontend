import { Outlet, Link } from 'react-router-dom';

export const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-cream">
      <header className="flex items-center justify-between px-6 py-5 sm:px-12">
        <Link to="/" className="flex items-center gap-2">
          <svg viewBox="0 0 64 64" className="h-8 w-8">
            <circle cx="32" cy="40" r="14" fill="#FF6B4A" />
            <circle cx="14" cy="22" r="7" fill="#FF6B4A" />
            <circle cx="32" cy="12" r="7.5" fill="#FF6B4A" />
            <circle cx="50" cy="22" r="7" fill="#FF6B4A" />
          </svg>
          <span className="font-display text-xl font-bold text-ink">PawfectCare</span>
        </Link>
        <Link to="/auth/login" className="btn-secondary text-sm">
          Log in
        </Link>
      </header>

      <main className="px-6 pb-16 sm:px-12">
        <Outlet />
      </main>
    </div>
  );
};