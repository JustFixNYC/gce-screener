// https://blog.logrocket.com/creating-reusable-pop-up-modal-react/
import React, { useRef, useEffect } from "react";
import "./Modal.scss";
import { Button } from "@justfixnyc/component-library";
import { JFCLLinkExternal } from "../JFCLLink";
import classNames from "classnames";

export interface ModalProps {
  isOpen: boolean;
  hasCloseBtn?: boolean;
  onClose?: () => void;
  header?: string;
  className?: string;
  children: React.ReactNode;
}

const Modal = ({
  isOpen,
  onClose,
  hasCloseBtn = true,
  header,
  className,
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
      className={classNames("modal", className, hasCloseBtn && "has-close")}
      onKeyDown={handleKeyDown}
      onClick={handleClickOutside}
    >
      {hasCloseBtn && (
        <Button
          variant="tertiary"
          labelIcon="xmark"
          labelText=""
          iconOnly={true}
          className="modal__close"
          onClick={handleCloseModal}
          aria-label="Close modal"
        />
      )}
      <div className="modal__content">
        <>
          <h3 className="modal__header">{header}</h3>
          {children}
        </>
      </div>
    </dialog>
  );
};

export const RentStabLeaseModal: React.FC<Omit<ModalProps, "children">> = (
  props
) => (
  <Modal {...props} header="To help guide your answer">
    <p>
      If your most recent lease renewal looks like the image below, then your
      apartment is almost certainly rent stabilized. If your lease renewal does
      not look like the image below, your apartment could still be rent
      stabilized.
    </p>
    <figure>
      <figcaption>
        Full image of lease can be viewed on{" "}
        <JFCLLinkExternal to="https://hcr.ny.gov/system/files/documents/2024/07/rtp-8-07-2024-fillable_1.pdf">
          hcr.ny.gov
        </JFCLLinkExternal>
      </figcaption>
      <img
        src="/rent-stabilized-lease-sample.png"
        alt="Sample image of blank rent stabilized lease"
      />
    </figure>
  </Modal>
);

export default Modal;
