
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    console.log('AuthModal: Attempting auth with:', { email, isSignUp });
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    if (isSignUp && password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    const { error: authError } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password);
    
    if (authError) {
      console.error('AuthModal: Auth error:', authError);
      setError(authError.message || `${isSignUp ? 'Sign up' : 'Sign in'} failed. Please try again.`);
    } else {
      console.log('AuthModal: Auth success, closing modal');
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setError('');
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isSignUp ? 'Create Account' : 'Sign In'}</DialogTitle>
          <DialogDescription>
            {isSignUp ? 'Create a new account to get started.' : 'Sign in to your account.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              placeholder={isSignUp ? 'Create a password (min. 6 characters)' : 'Enter your password'}
              minLength={isSignUp ? 6 : undefined}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={loading || !email || !password}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={toggleMode}
            disabled={loading}
          >
            {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
