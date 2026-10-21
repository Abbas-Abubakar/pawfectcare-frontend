export const Skeleton = ({ className = '' }: { className?: string }) => (
  // motion-safe: people who prefer reduced motion get plain grey blocks instead of a pulse
  <div aria-hidden="true" className={`rounded-2xl bg-ink/10 motion-safe:animate-pulse ${className}`} />
);