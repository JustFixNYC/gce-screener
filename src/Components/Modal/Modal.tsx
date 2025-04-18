// https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
import React, { useRef, useEffect } from "react";
import "./Modal.scss";
import { Icon } from "@justfixnyc/component-library";

interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  hasCloseBtn = true,
  children,
}: ModalProps) => {
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleCloseModal = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "Escape") {
      handleCloseModal();
    }
  };

  const handleClickOutside = (
    event: React.MouseEvent<HTMLDialogElement, MouseEvent>
  ) => {
    const modalElement = modalRef.current;
    if (!modalElement) return;
    // div covers entire visible modal, so click anywhere on dialog background should close
    if (modalElement !== event.target) return;
    handleCloseModal();
  };

  useEffect(() => {
    const modalElement = modalRef.current;
    if (!modalElement) return;

    // Open modal when 'isOpen' changes to true
    if (isOpen) {
      modalElement.showModal();
    } else {
      modalElement.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={modalRef}
      className="modal"
      onKeyDown={handleKeyDown}
      onClick={handleClickOutside}
    >
      <div className="modal__content">
        {hasCloseBtn && (
          <button
            className="modal__close"
            onClick={handleCloseModal}
            aria-label="Close modal"
          >
            <Icon icon="xmark" />
          </button>
        )}
        {children}
      </div>
    </dialog>
  );
};

export default Modal;
