import { useCallback, useState } from "react";

type UseDisclosureProps = {
  isOpen?: boolean;
  defaultIsOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
};

type UseDisclosureReturn = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};

export const useDisclosure = ({
  isOpen: isOpenProp,
  defaultIsOpen,
  onClose,
  onOpen,
}: UseDisclosureProps = {}): UseDisclosureReturn => {
  const isControlled = isOpenProp !== undefined;
  const [isOpenState, setIsOpen] = useState(defaultIsOpen ?? false);

  const isOpen = isControlled ? isOpenProp : isOpenState;

  const onOpenCallback = useCallback(() => {
    setIsOpen(true);
    onOpen?.();
  }, [onOpen]);

  const onCloseCallback = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const onToggle = useCallback(() => {
    if (isOpen) {
      onCloseCallback();
    } else {
      onOpenCallback();
    }
  }, [isOpen, onCloseCallback, onOpenCallback]);

  return {
    isOpen,
    onOpen: onOpenCallback,
    onClose: onCloseCallback,
    onToggle,
  };
};
