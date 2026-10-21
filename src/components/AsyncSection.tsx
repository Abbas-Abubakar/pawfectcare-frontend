import type { ReactNode } from 'react';
import { EmptyState } from './EmptyState';

interface AsyncSectionProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  onRetry: () => void;
  skeleton: ReactNode;
  empty: ReactNode;
  errorMessage?: string;
  children: ReactNode;
}

export const AsyncSection = ({
  isLoading,
  isError,
  isEmpty,
  onRetry,
  skeleton,
  empty,
  errorMessage = "We couldn't load this right now. Please try again.",
  children,
}: AsyncSectionProps) => {
  if (isLoading) return <>{skeleton}</>;

  // If there is something to show, show it, even when a later background
  // refetch failed. Replacing real content with an error would be worse.
  if (!isEmpty) return <>{children}</>;

  // Nothing to show AND the request failed: this is an error, not "no data".
  // Without this check, a failed request would claim there are no pets.
  if (isError) {
    return (
      <EmptyState
        variant="card"
        emoji="😿"
        title="Something went wrong"
        message={errorMessage}
        action={{ label: 'Try again', onClick: onRetry }}
      />
    );
  }

  return <>{empty}</>;
};