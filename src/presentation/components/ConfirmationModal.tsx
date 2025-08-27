import React from 'react';

export interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDestructive?: boolean;
    isLoading?: boolean;
}

function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    isDestructive = false,
    isLoading = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleBackdropClick}>
            <div className="modal-content confirmation-modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="modal-close-button" onClick={onClose} disabled={isLoading}>
                        ×
                    </button>
                </div>

                <div className="modal-body">
                    <p>{message}</p>
                </div>

                <div className="modal-actions">
                    <button
                        type="button"
                        className="cancel-button"
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelButtonText}
                    </button>
                    <button
                        type="button"
                        className={`confirm-button ${isDestructive ? 'destructive' : 'primary'}`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : confirmButtonText}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;
