import { DEMO_ACCOUNTS, SHOW_DEMO_ACCOUNTS } from '@/config/demoAccounts';

interface DemoAccountsProps {
  onSelect: (email: string, password: string) => void;
  disabled?: boolean;
}

export const DemoAccounts = ({ onSelect, disabled }: DemoAccountsProps) => {
  if (!SHOW_DEMO_ACCOUNTS) return null;

  return (
    <div className="mt-8 rounded-3xl bg-sunshine/20 p-5">
      <p className="font-display text-lg font-bold text-ink">Just looking around?</p>
      <p className="mt-1 text-sm text-ink/60">Jump into a demo account. No signup needed.</p>

      <div className="mt-4 space-y-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.role}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(account.email, account.password)}
            className="flex w-full items-center gap-3 rounded-2xl bg-white px-4 py-3 text-left transition-colors hover:bg-coral-light disabled:opacity-60"
          >
            <span className="text-2xl">{account.emoji}</span>
            <span>
              <span className="block text-sm font-semibold text-ink">{account.label}</span>
              <span className="block text-xs text-ink/50">{account.blurb}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};