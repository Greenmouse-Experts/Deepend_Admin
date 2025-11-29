import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { Toaster } from "sonner";
import { X } from "lucide-react"; // Import the X icon

interface ModalProps {
  children: React.ReactNode;
  action?: (item?: any) => any;
  actionName?: string;
  title?: string; // Added title prop for better UI
}

export interface ModalHandle {
  open: () => void;
  close: () => void;
}

const Modal = forwardRef<ModalHandle, ModalProps>(
  ({ children, action, actionName, title }, ref) => {
    const modalRef = useRef<HTMLDialogElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => {
        modalRef.current?.showModal();
      },
      close: () => {
        modalRef.current?.close();
      },
    }));

    return (
      <dialog ref={modalRef} className="modal modal-middle sm:modal-middle">
        <Toaster theme="dark" richColors />
        <div className="modal-box max-w-2xl max-h-[90vh] p-6 rounded-lg shadow-xl relative">
          <form method="dialog" className="absolute right-4 top-4">
            <button
              className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:text-gray-700"
              onClick={() => modalRef.current?.close()}
            >
              <X size={20} />
            </button>
          </form>
          {title && <h3 className="font-bold text-lg mb-4">{title}</h3>}
          {children}
        </div>
      </dialog>
    );
  },
);

Modal.displayName = "Modal";

export default Modal;
