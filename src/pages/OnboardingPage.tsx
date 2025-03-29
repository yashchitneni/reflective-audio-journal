
import React from 'react';
import OnboardingForm from '@/components/Auth/OnboardingForm';
import { BookIcon } from 'lucide-react';

const OnboardingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-reflect-background">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-reflect-gradient flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold font-heading reflect-gradient-text m-0">ReflectFlow</h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-2">Set Up Your Profile</h2>
          <p className="text-reflect-muted">
            Let's tailor ReflectFlow to your preferences
          </p>
        </div>
        
        <OnboardingForm />
      </div>
    </div>
  );
};

export default OnboardingPage;
