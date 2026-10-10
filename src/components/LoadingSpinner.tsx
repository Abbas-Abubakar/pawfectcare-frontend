interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

const SIZE_CLASSES = {
  sm: 'h-4 w-4 border-2',
  md: 'h-8 w-8 border-[3px]',
  lg: 'h-12 w-12 border-4',
};

export const LoadingSpinner = ({ size = 'md', label }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`animate-spin rounded-full border-coral-light border-t-coral ${SIZE_CLASSES[size]}`}
        role="status"
        aria-label={label ?? 'Loading'}
      />
      {label && <p className="font-display text-sm text-ink/50">{label}</p>}
    </div>
  );
};