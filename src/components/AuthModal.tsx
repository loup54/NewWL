import React from 'react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={() => onOpenChange(false)}
    >
      <div
        style={{
          background: 'white',
          padding: 32,
          borderRadius: 8,
          minWidth: 300,
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2>Sign In</h2>
        <p>This is a placeholder for the Auth Modal.</p>
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    </div>
  );
}; 