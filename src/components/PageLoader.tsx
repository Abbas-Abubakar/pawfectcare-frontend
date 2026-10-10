import { LoadingSpinner } from './LoadingSpinner';

export const PageLoader = ({ label = 'Loading...' }: { label?: string }) => {
  return (
    <div className="flex h-64 items-center justify-center">
      <LoadingSpinner size="lg" label={label} />
    </div>
  );
};