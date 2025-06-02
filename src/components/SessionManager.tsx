
import React from 'react';
import { useSessionManagement } from '@/hooks/useSessionManagement';
import { EmailVerification } from '@/components/EmailVerification';
import { useAuth } from '@/contexts/AuthContext';

interface SessionManagerProps {
  children: React.ReactNode;
}

export const SessionManager: React.FC<SessionManagerProps> = ({ children }) => {
  const { user } = useAuth();
  useSessionManagement(); // This hook handles all session management logic

  return (
    <div>
      {/* Show email verification banner for unverified users */}
      {user && !user.email_confirmed_at && !user.confirmed_at && (
        <div className="border-b border-yellow-200 bg-yellow-50 p-3">
          <div className="max-w-7xl mx-auto">
            <EmailVerification />
          </div>
        </div>
      )}
      {children}
    </div>
  );
};
