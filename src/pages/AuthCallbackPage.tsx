import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getUserByAuthId } from '@/integrations/supabase/client';

const AuthCallbackPage = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback');
        setIsProcessing(true);
        
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback session error:', error);
          throw error;
        }
        
        if (data.session) {
          console.log('Session found in callback, user:', data.session.user.id);
          
          // Check if this is a new user (first sign-in)
          const userProfile = await getUserByAuthId(data.session.user.id);
            
          if (!userProfile) {
            console.log('New user, redirecting to onboarding');
            // New user, redirect to onboarding
            navigate('/onboarding');
          } else {
            console.log('Existing user, redirecting to dashboard');
            // Existing user, redirect to dashboard
            navigate('/dashboard');
          }
        } else {
          console.log('No session found in callback, redirecting to login');
          // No session, redirect to login
          navigate('/login');
        }
      } catch (err: any) {
        console.error('Auth callback error:', err);
        setError(err.message || 'Authentication failed. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-reflect-background">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-reflect-primary mx-auto mb-4"></div>
            <p className="text-reflect-primary font-medium">Processing your authentication...</p>
          </>
        ) : error ? (
          <>
            <p className="text-red-600 font-medium mb-2">Authentication Error</p>
            <p className="text-reflect-muted mb-4">{error}</p>
            <p className="text-sm text-reflect-muted">Redirecting you to login page...</p>
          </>
        ) : (
          <p className="text-reflect-muted">Redirecting you to the appropriate page...</p>
        )}
      </div>
    </div>
  );
};

export default AuthCallbackPage;
