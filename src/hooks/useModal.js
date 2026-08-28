import { useState, useCallback } from 'react';

/**
 * Manages modal visibility and payload data states cleanly.
 */
export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  const open = useCallback((data = null) => {
    setModalData(data);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setModalData(null);
  }, []);

  return {
    isOpen,
    modalData,
    open,
    close,
  };
}
