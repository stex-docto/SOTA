import React from 'react';
import { FirebaseAuthUI } from './FirebaseAuthUI';

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SignInModal({ isOpen, onClose }: SignInModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <FirebaseAuthUI />
        </div>
      </div>
    </div>
  );
}