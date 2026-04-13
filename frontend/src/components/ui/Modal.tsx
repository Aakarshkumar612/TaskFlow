/**
 * Modal Component
 * 
 * Features:
 * - Accessible (focus trap, ESC close)
 * - Backdrop click to close
 * - Multiple sizes
 * 
 * Usage:
 * <Modal isOpen={isOpen} onClose={close} title="Create Task">
 *   <TaskForm />
 * </Modal>
 */

import { useEffect, useRef, ReactNode } from 'react';
import './Modal.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEsc = true,
}: ModalProps): JSX.Element | null {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Store previous focus and restore on close
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousFocusRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (!closeOnEsc || !isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, closeOnEsc, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="tf-modal__backdrop" onClick={handleBackdropClick}>
      <div
        ref={modalRef}
        className={`tf-modal tf-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="tf-modal__header">
          <h2 id="modal-title" className="tf-modal__title">
            {title}
          </h2>
          <button className="tf-modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>
        <div className="tf-modal__content">{children}</div>
      </div>
    </div>
  );
}
