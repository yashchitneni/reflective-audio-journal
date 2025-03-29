
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailIcon, LockIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // TODO: Implement actual authentication with Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just navigate to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
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
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-sm text-reflect-primary hover:underline">
              Forgot password?
            </Link>
          </div>
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
        </div>
        
        <Button 
          type="submit" 
          className="reflect-button w-full" 
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-reflect-muted">
            Don't have an account?{' '}
            <Link to="/register" className="text-reflect-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
