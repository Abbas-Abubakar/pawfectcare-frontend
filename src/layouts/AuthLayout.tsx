import { Outlet, useMatches } from 'react-router-dom';
import { PawBlobPanel } from '../components/illustrations/PawBlobPanel';

interface AuthHandle {
  panelTitle?: string;
  panelSubtitle?: string;
}

const DEFAULT_TITLE = 'Every pet deserves a pawfect home';
const DEFAULT_SUBTITLE =
  'Track health records, book vet visits, and find your new best friend — all in one place.';

export const AuthLayout = () => {
  const matches = useMatches();
  const currentMatch = matches[matches.length - 1];
  const handle = (currentMatch?.handle ?? {}) as AuthHandle;

  return (
    <div className="flex min-h-screen bg-cream">
      <PawBlobPanel
        title={handle.panelTitle ?? DEFAULT_TITLE}
        subtitle={handle.panelSubtitle ?? DEFAULT_SUBTITLE}
      />

      <div className="flex w-full flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:w-[55%] lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <svg viewBox="0 0 64 64" className="h-8 w-8">
              <circle cx="32" cy="40" r="14" fill="#FF6B4A" />
              <circle cx="14" cy="22" r="7" fill="#FF6B4A" />
              <circle cx="32" cy="12" r="7.5" fill="#FF6B4A" />
              <circle cx="50" cy="22" r="7" fill="#FF6B4A" />
            </svg>
            <span className="font-display text-xl font-bold text-ink">PawfectCare</span>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
};