
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSubmit: (email: string, password: string) => Promise<{ error: any }>;
  loading: boolean;
  onSuccess?: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, loading, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`AuthForm: ${mode} attempt started`);
    setLocalError('');
    
    if (!email || !password) {
      console.log('AuthForm: Missing email or password');
      setLocalError('Please enter both email and password');
      return;
    }

    if (mode === 'signup' && password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }
    
    const { error } = await onSubmit(email, password);
    if (!error) {
      console.log(`AuthForm: ${mode} successful`);
      setEmail('');
      setPassword('');
      setLocalError('');
      onSuccess?.();
    } else {
      setLocalError(error.message || `${mode} failed`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {localError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor={`${mode}-email`}>Email</Label>
        <Input
          id={`${mode}-email`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          placeholder="Enter your email"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor={`${mode}-password`}>Password</Label>
        <Input
          id={`${mode}-password`}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          placeholder={mode === 'signup' ? 'Create a password (min. 6 characters)' : 'Enter your password'}
          minLength={mode === 'signup' ? 6 : undefined}
        />
      </div>
      
      <Button type="submit" className="w-full" disabled={loading || !email || !password}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {mode === 'signin' ? 'Sign In' : 'Create Account'}
      </Button>
    </form>
  );
};
