
import React from 'react';
import RegisterForm from '@/components/Auth/RegisterForm';
import { BookIcon } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-reflect-gradient flex items-center justify-center p-8">
        <div className="max-w-md w-full text-white">
          <div className="mb-8 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <BookIcon className="w-6 h-6 text-reflect-primary" />
            </div>
            <h1 className="text-3xl font-bold font-heading text-white m-0">ReflectFlow</h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4 font-heading">Start Your Journey</h2>
          <p className="text-lg mb-6 text-white/80">
            Transform your daily reflections into a powerful tool for personal growth and mindfulness.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">How It Works</h3>
            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white font-semibold">1</span>
                </div>
                <span>Create daily journal entries with text, voice, or photos</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white font-semibold">2</span>
                </div>
                <span>AI analyzes your entries to identify patterns and insights</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="bg-white/20 w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-white font-semibold">3</span>
                </div>
                <span>Generate personalized audio content based on your reflections</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Create Your Account</h2>
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
