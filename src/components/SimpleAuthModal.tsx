
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/SimpleAuthContext';
import { AuthForm } from '@/components/auth/AuthForm';

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SimpleAuthModal: React.FC<AuthModalProps> = ({ open, onOpenChange }) => {
  const { signIn, signUp, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('signin');

  const handleSignInSuccess = () => {
    console.log('SimpleAuthModal: Sign in successful, closing modal');
    onOpenChange(false);
  };

  const handleSignUpSuccess = () => {
    console.log('SimpleAuthModal: Sign up successful');
    // Don't close modal immediately in case email confirmation is needed
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to WordLens</DialogTitle>
          <DialogDescription>
            Sign in to your account or create a new one to get started.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <AuthForm
              mode="signin"
              onSubmit={signIn}
              loading={loading}
              onSuccess={handleSignInSuccess}
            />
          </TabsContent>
          
          <TabsContent value="signup">
            <AuthForm
              mode="signup"
              onSubmit={signUp}
              loading={loading}
              onSuccess={handleSignUpSuccess}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
