import { Link } from 'react-router-dom';

type EmptyStateAction =
  | { label: string; to: string; onClick?: never }
  | { label: string; onClick: () => void; to?: never };

interface EmptyStateProps {
  emoji: string;
  title: string;
  message?: string;
  action?: EmptyStateAction;
  // 'card': white rounded card, for sitting inside a page section.
  // 'plain': no background, for filling a whole content area.
  variant?: 'card' | 'plain';
}

export const EmptyState = ({ emoji, title, message, action, variant = 'plain' }: EmptyStateProps) => {
  const wrapper = variant === 'card' ? 'rounded-4xl bg-white px-6 py-10' : 'py-12';

  return (
    <div className={`flex flex-col items-center gap-2 text-center ${wrapper}`}>
      <p className="text-5xl" aria-hidden="true">
        {emoji}
      </p>
      <h3 className="mt-1 font-display text-xl font-bold text-ink">{title}</h3>
      {message && <p className="max-w-md text-sm text-ink/60">{message}</p>}
      {action &&
        (action.to ? (
          <Link to={action.to} className="btn-secondary mt-3 text-sm">
            {action.label}
          </Link>
        ) : (
          <button type="button" onClick={action.onClick} className="btn-secondary mt-3 text-sm">
            {action.label}
          </button>
        ))}
    </div>
  );
};