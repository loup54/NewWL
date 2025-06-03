
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X, Shield } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const { isAdmin } = useUserRoles();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (user) {
      navigate('/validation');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button onClick={handleLogoClick} className="flex items-center space-x-2">
              <FileText className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">WordLens</span>
            </button>

            {/* Desktop Navigation - only show for authenticated users */}
            {user && (
              <nav className="hidden md:flex items-center space-x-4">
                <Link
                  to="/validation"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/validation' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Validation
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                      location.pathname === '/admin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </nav>
            )}

            {/* User Menu / Auth Button */}
            <div className="flex items-center space-x-4">
              {loading ? (
                <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full"></div>
              ) : user ? (
                <UserMenu />
              ) : (
                <Button onClick={() => setShowAuthModal(true)}>
                  Sign In
                </Button>
              )}

              {/* Mobile menu button - only show for authenticated users */}
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile Navigation - only show for authenticated users */}
          {user && mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/validation"
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === '/validation' 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Validation
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center gap-1 ${
                      location.pathname === '/admin' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </>
  );
};
