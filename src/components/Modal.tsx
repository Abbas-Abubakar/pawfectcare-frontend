import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  // Close on Escape key, and prevent the page behind the modal from scrolling
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/40" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-4xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-ink/40 hover:bg-cream hover:text-ink"
            aria-label="Close"
          >
            ✕
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body
  );
};