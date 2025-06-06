import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Menu, X, Shield, BarChart2, Settings } from 'lucide-react';
import { AuthModal } from '@/components/AuthModal';
import { UserMenu } from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRoles } from '@/hooks/useUserRoles';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogoClick = () => {
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Home', icon: FileText },
    { path: '/analyze', label: 'Analyze', icon: FileText },
    { path: '/compare', label: 'Compare', icon: BarChart2 },
    { path: '/validation', label: 'Validation', icon: FileText },
    { path: '/settings', label: 'Settings', icon: Settings },
    { path: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button onClick={handleLogoClick} className="flex items-center space-x-2">
            <FileText className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">WordLens</span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(path)
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <UserMenu />
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>
                Sign In
              </Button>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      <AuthModal
        open={showAuthModal}
        onOpenChange={setShowAuthModal}
      />
    </header>
  );
};
