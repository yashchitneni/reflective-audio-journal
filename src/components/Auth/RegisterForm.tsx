
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MailIcon, LockIcon, UserIcon, AlertCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // TODO: Implement actual registration with Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just navigate to onboarding
      window.location.href = '/onboarding';
    } catch (err) {
      setError('Could not create account. Please try again.');
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
