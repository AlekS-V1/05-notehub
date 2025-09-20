import { useEffect } from 'react';
import css from '../Modal/Modal.module.css';
import { createPortal } from "react-dom";

interface ModalProps {
    onClose: () => void;
    isOpen?: boolean;
    children: React.ReactNode;
}

export default function Modal({ children, onClose }: ModalProps) {
    
    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };
  
  useEffect(() => {
	  const handleKeyDown = (e: KeyboardEvent) => {
	    if (e.key === "Escape") {
	      onClose();
	    }
	  };
	
	  document.addEventListener("keydown", handleKeyDown);
	
	  return () => {
	    document.removeEventListener("keydown", handleKeyDown);
	  };
	}, [onClose]);

    return createPortal(
        <div
            className={css.backdrop}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true">
            
            <div className={css.modal}>
                <button
                    className={css.closeButton}
                    onClick={onClose}
                    aria-label="Close modal"
                >&times;
                </button>

                {children}
                {/* */}
            </div>
        </div>,
    document.body
  );
}