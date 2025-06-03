
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimpleAuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AuthModal: Sign in attempt started');
    setLocalError('');
    
    if (!email || !password) {
      console.log('AuthModal: Missing email or password');
      setLocalError('Please enter both email and password');
      return;
    }
    
    const { error } = await signIn(email, password);
    if (!error) {
      console.log('AuthModal: Sign in successful, closing modal');
      onOpenChange(false);
      setEmail('');
      setPassword('');
      setLocalError('');
    } else {
      setLocalError(error.message || 'Sign in failed');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AuthModal: Sign up attempt started');
    setLocalError('');
    
    if (!email || !password) {
      console.log('AuthModal: Missing email or password');
      setLocalError('Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    const { error } = await signUp(email, password);
    if (!error) {
      console.log('AuthModal: Sign up successful');
      // Don't close modal immediately in case email confirmation is needed
      setEmail('');
      setPassword('');
      setLocalError('');
    } else {
      setLocalError(error.message || 'Sign up failed');
    }
  };

  const handleTabChange = () => {
    setLocalError('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to WordLens</DialogTitle>
        </DialogHeader>
        
        {localError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{localError}</AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="signin" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signin-password">Password</Label>
                <Input
                  id="signin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your password"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Enter your email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Create a password (min. 6 characters)"
                  minLength={6}
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading || !email || !password}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
