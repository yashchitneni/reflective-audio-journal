
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailIcon, LockIcon, UserIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Separator } from '@/components/ui/separator';
import { FcGoogle } from 'react-icons/fc';
import { toast } from '@/hooks/use-toast';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }
    
    try {
      await signUp(email, password, name);
    } catch (err: any) {
      setError(err.message || 'Could not create your account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signInWithGoogle();
      // No need to navigate here as the OAuth redirect will handle that
    } catch (err: any) {
      toast({
        title: "Google login failed",
        description: err.message || "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      // This may not be reached immediately due to the redirect
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <UserIcon className="w-4 h-4 text-reflect-muted" />
            </div>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="pl-10 reflect-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MailIcon className="w-4 h-4 text-reflect-muted" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="pl-10 reflect-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <LockIcon className="w-4 h-4 text-reflect-muted" />
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="pl-10 reflect-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <p className="text-xs text-reflect-muted mt-1">Must be at least 8 characters</p>
        </div>
        
        <Button 
          type="submit" 
          className="reflect-button w-full"
          disabled={isLoading} 
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-reflect-muted">Or continue with</span>
          </div>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
        >
          <FcGoogle className="w-5 h-5" />
          <span>{isGoogleLoading ? 'Connecting...' : 'Sign up with Google'}</span>
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-reflect-muted">
            Already have an account?{' '}
            <Link to="/login" className="text-reflect-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
