
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t py-6 mt-auto">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="font-heading font-bold text-lg reflect-gradient-text">
              ReflectFlow
            </Link>
            <p className="text-sm text-reflect-muted mt-1">
              Your daily reflections, transformed.
            </p>
          </div>
          
          <div className="flex gap-6">
            <Link to="/about" className="text-sm text-reflect-muted hover:text-reflect-primary transition-colors">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-reflect-muted hover:text-reflect-primary transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-reflect-muted hover:text-reflect-primary transition-colors">
              Terms
            </Link>
          </div>
          
          <div className="mt-4 md:mt-0 text-sm text-reflect-muted">
            © {year} ReflectFlow
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
