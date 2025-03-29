
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MicIcon, CalendarIcon, BookIcon, UserIcon } from 'lucide-react';

const Navbar = () => {
  return (
    <header className="bg-white shadow-sm py-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-reflect-gradient flex items-center justify-center">
            <BookIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-heading font-bold text-xl reflect-gradient-text">ReflectFlow</span>
        </Link>
        
        <nav className="hidden md:flex gap-8 items-center">
          <Link to="/journal" className="text-reflect-text hover:text-reflect-primary transition-colors">Journal</Link>
          <Link to="/calendar" className="text-reflect-text hover:text-reflect-primary transition-colors">Calendar</Link>
          <Link to="/audio" className="text-reflect-text hover:text-reflect-primary transition-colors">Audio Library</Link>
        </nav>
        
        <div className="flex items-center gap-2">
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
        </div>
      </div>
    </header>
  );
};

export default Navbar;
