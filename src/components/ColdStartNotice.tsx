import { useEffect, useState } from 'react';
import { useIsFetching } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';

const DELAY_MS = 5000;

export const ColdStartNotice = () => {
  const isFetching = useIsFetching() > 0;
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const isBusy = isFetching || isAuthLoading;

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!isBusy) {
      setShow(false);
      return;
    }
    // Only appears if something has been loading for a full 5 seconds;
    // if loading finishes sooner, the cleanup cancels the timer.
    const timer = setTimeout(() => setShow(true), DELAY_MS);
    return () => clearTimeout(timer);
  }, [isBusy]);

  if (!show) return null;

  return (
    <p
      role="status"
      className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-ink px-4 py-3 text-center text-sm text-white shadow-xl"
    >
      Still loading. The server may be waking up after a quiet period, which can take about a minute.
    </p>
  );
};