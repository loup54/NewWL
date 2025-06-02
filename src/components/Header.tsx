
import React, { useState } from 'react';
import { FileText, BarChart3, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserMenu } from '@/components/UserMenu';
import { AuthModal } from '@/components/AuthModal';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const { user, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WordLens</h1>
                <p className="text-sm text-gray-600">Insight Engine</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <BarChart3 className="w-4 h-4" />
                <span>Document Analytics</span>
              </div>
              
              {!loading && (
                user ? (
                  <UserMenu />
                ) : (
                  <Button onClick={() => setShowAuthModal(true)} size="sm">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                )
              )}
            </div>
          </div>
        </div>
      </header>
      
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </>
  );
};
