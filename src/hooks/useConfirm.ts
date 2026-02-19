import { useCallback, useState } from "react";

export const useConfirm = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const askConfirm = useCallback((id: string) => {
    setSelectedId(id);
    setIsOpen(true);
  }, []);

  const closeConfirm = useCallback(() => {
    setIsOpen(false);
    setSelectedId(null);
  }, []);

  return { isOpen, selectedId, askConfirm, closeConfirm };
};
