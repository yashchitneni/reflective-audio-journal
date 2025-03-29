
import React from 'react';
import LoginForm from '@/components/Auth/LoginForm';
import { BookIcon } from 'lucide-react';

const LoginPage = () => {
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
          
          <h2 className="text-4xl font-bold mb-4 font-heading">Welcome Back</h2>
          <p className="text-lg mb-6 text-white/80">
            Your daily reflections, transcribed, analyzed, and transformed into personalized audio.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Why ReflectFlow?</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-white font-bold text-lg">•</span>
                <span>Daily journaling made simple and consistent</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold text-lg">•</span>
                <span>Automatically transcribe your spoken reflections</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold text-lg">•</span>
                <span>Convert your entries into personalized audio content</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-white font-bold text-lg">•</span>
                <span>Insights and patterns to help personal growth</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign In to ReflectFlow</h2>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
