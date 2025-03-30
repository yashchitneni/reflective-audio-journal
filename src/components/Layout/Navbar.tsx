
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MicIcon, CalendarIcon, BookIcon, UserIcon, HomeIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isLoggedIn = !!user;
  
  // Helper function to determine if a path is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo - links to dashboard if logged in, home if not */}
        <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-reflect-gradient flex items-center justify-center">
            <BookIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl reflect-gradient-text">ReflectFlow</span>
        </Link>
        
        {/* Main navigation - only show when logged in */}
        {isLoggedIn ? (
          <nav className="hidden md:flex gap-8 items-center">
            <Link 
              to="/dashboard" 
              className={`text-reflect-text transition-colors ${isActive('/dashboard') ? 'text-reflect-primary font-medium' : 'hover:text-reflect-primary'}`}
            >
              Home
            </Link>
            <Link 
              to="/journal" 
              className={`text-reflect-text transition-colors ${isActive('/journal') ? 'text-reflect-primary font-medium' : 'hover:text-reflect-primary'}`}
            >
              Journal
            </Link>
            <Link 
              to="/calendar" 
              className={`text-reflect-text transition-colors ${isActive('/calendar') ? 'text-reflect-primary font-medium' : 'hover:text-reflect-primary'}`}
            >
              Calendar
            </Link>
            <Link 
              to="/audio" 
              className={`text-reflect-text transition-colors ${isActive('/audio') ? 'text-reflect-primary font-medium' : 'hover:text-reflect-primary'}`}
            >
              Audio Library
            </Link>
          </nav>
        ) : (
          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-reflect-text hover:text-reflect-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-reflect-text hover:text-reflect-primary transition-colors">How It Works</a>
          </nav>
        )}
        
        {/* Right side buttons */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <Link to="/new-entry">
                <Button className="reflect-button">
                  <MicIcon className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">New Entry</span>
                </Button>
              </Link>
              
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserIcon className="w-5 h-5" />
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden md:block">
                <Button variant="outline">Login</Button>
              </Link>
              <Link to="/register">
                <Button className="reflect-button">
                  <span className="hidden sm:inline">Sign Up</span>
                  <span className="sm:hidden">Get Started</span>
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
