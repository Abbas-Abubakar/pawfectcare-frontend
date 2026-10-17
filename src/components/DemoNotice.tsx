import type { ReactNode } from 'react';
import { SHOW_DEMO_ACCOUNTS } from '@/config/demoAccounts';

export const DemoNotice = ({ children }: { children: ReactNode }) => {
  if (!SHOW_DEMO_ACCOUNTS) return null;

  return <div className="mb-6 rounded-2xl bg-sunshine/20 px-4 py-3 text-sm text-ink/70">{children}</div>;
};