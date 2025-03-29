
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BookIcon, MicIcon, CalendarIcon, MessageSquareIcon, SparklesIcon } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-reflect-gradient flex items-center justify-center">
              <BookIcon className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading font-bold text-xl reflect-gradient-text">ReflectFlow</span>
          </div>
          
          <div className="hidden md:flex gap-6 items-center">
            <a href="#features" className="text-reflect-text hover:text-reflect-primary transition-colors">Features</a>
            <a href="#how-it-works" className="text-reflect-text hover:text-reflect-primary transition-colors">How It Works</a>
            <Link to="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="reflect-button">Sign Up</Button>
            </Link>
          </div>
          
          <div className="md:hidden">
            <Link to="/register">
              <Button className="reflect-button">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-reflect-primary to-reflect-secondary text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-4 leading-tight text-white">
                Your daily reflections, <span className="text-transparent bg-clip-text bg-white/90">transcribed and transformed</span>
              </h1>
              <p className="text-xl text-white/80 mb-8">
                Journal with text, voice, or photos. Let AI analyze your entries and create personalized audio content to enhance your well-being.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/register">
                  <Button className="text-reflect-primary bg-white hover:bg-white/90 hover:text-reflect-primary rounded-md px-8 py-3 font-semibold text-lg">
                    Start Journaling
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" className="border-white text-white hover:bg-white/10 rounded-md px-8 py-3 font-semibold text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 shadow-xl relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                    <MicIcon className="w-4 h-4 text-reflect-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Voice Journal</h3>
                    <p className="text-sm text-white/70">Today, 9:15 AM</p>
                  </div>
                </div>
                <p className="mb-4">
                  "I'm feeling excited about the upcoming presentation. The team has been supportive and I think we're well prepared..."
                </p>
                <div className="bg-white/20 rounded-md p-3 text-sm">
                  <p className="font-medium mb-1">AI Generated Audio:</p>
                  <p className="text-white/70">
                    "Confidence Booster: A personalized reflection on your presentation readiness"
                  </p>
                </div>
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-white/20 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-16 bg-reflect-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Powerful Features</h2>
            <p className="text-xl text-reflect-muted max-w-2xl mx-auto">
              ReflectFlow combines journaling, AI analysis, and audio content generation to enhance your self-reflection practice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="reflect-card text-center p-6">
              <div className="w-12 h-12 bg-reflect-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MicIcon className="w-6 h-6 text-reflect-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Modal Journaling</h3>
              <p className="text-reflect-muted">
                Express yourself through text, voice recordings that get automatically transcribed, or photos with captions.
              </p>
            </div>
            
            <div className="reflect-card text-center p-6">
              <div className="w-12 h-12 bg-reflect-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CalendarIcon className="w-6 h-6 text-reflect-secondary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calendar Integration</h3>
              <p className="text-reflect-muted">
                Connect your calendar to receive context-aware prompts based on your upcoming events and activities.
              </p>
            </div>
            
            <div className="reflect-card text-center p-6">
              <div className="w-12 h-12 bg-reflect-accent/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <SparklesIcon className="w-6 h-6 text-reflect-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-reflect-muted">
                Our AI analyzes your entries to identify patterns and generate personalized audio content for reflection.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">How ReflectFlow Works</h2>
            <p className="text-xl text-reflect-muted max-w-2xl mx-auto">
              A simple three-step process to transform your journaling practice.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-reflect-primary flex items-center justify-center mx-auto text-white font-bold text-xl">
                  1
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-reflect-primary -z-10 transform -translate-x-8"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Journal Daily</h3>
              <p className="text-reflect-muted">
                Create entries using text, voice recordings, or photos. Our AI transcribes voice notes automatically.
              </p>
            </div>
            
            <div className="text-center">
              <div className="relative mb-4">
                <div className="w-16 h-16 rounded-full bg-reflect-primary flex items-center justify-center mx-auto text-white font-bold text-xl">
                  2
                </div>
                <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-reflect-primary -z-10 transform -translate-x-8"></div>
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Analysis</h3>
              <p className="text-reflect-muted">
                The AI processes your entries to identify themes, emotional patterns, and areas for growth.
              </p>
            </div>
            
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 rounded-full bg-reflect-primary flex items-center justify-center mx-auto text-white font-bold text-xl">
                  3
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Audio Generation</h3>
              <p className="text-reflect-muted">
                Transform your reflections into personalized audio content like affirmations or guided meditations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 bg-reflect-primary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">What Our Users Say</h2>
            <p className="text-xl text-reflect-muted max-w-2xl mx-auto">
              Discover how ReflectFlow is transforming daily journaling practices.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-reflect-primary/20 flex items-center justify-center">
                  <span className="font-medium text-reflect-primary">MJ</span>
                </div>
                <div>
                  <h4 className="font-medium">Michael Johnson</h4>
                  <p className="text-sm text-reflect-muted">Product Manager</p>
                </div>
              </div>
              <p className="text-reflect-muted">
                "ReflectFlow has completely changed how I approach self-reflection. The voice recording feature makes it so easy to journal on the go, and the personalized audio content is incredibly helpful."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-reflect-secondary/20 flex items-center justify-center">
                  <span className="font-medium text-reflect-secondary">EL</span>
                </div>
                <div>
                  <h4 className="font-medium">Emma Lewis</h4>
                  <p className="text-sm text-reflect-muted">Entrepreneur</p>
                </div>
              </div>
              <p className="text-reflect-muted">
                "I love how the calendar integration gives me prompts related to my upcoming events. It's like having a personal coach helping me prepare mentally for important meetings."
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-reflect-accent/20 flex items-center justify-center">
                  <span className="font-medium text-reflect-accent">DR</span>
                </div>
                <div>
                  <h4 className="font-medium">David Rodriguez</h4>
                  <p className="text-sm text-reflect-muted">Engineer</p>
                </div>
              </div>
              <p className="text-reflect-muted">
                "The AI-generated audio content has been a game-changer for my morning routine. I listen to my personalized affirmations while getting ready, and it sets a positive tone for the day."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-reflect-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">Ready to Start Your Reflection Journey?</h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are transforming their journaling practice with ReflectFlow.
          </p>
          <Link to="/register">
            <Button className="text-reflect-primary bg-white hover:bg-white/90 hover:text-reflect-primary rounded-md px-8 py-3 font-semibold text-lg">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-reflect-gradient flex items-center justify-center">
                  <BookIcon className="w-5 h-5 text-white" />
                </div>
                <span className="font-heading font-bold text-xl reflect-gradient-text">ReflectFlow</span>
              </div>
              <p className="text-reflect-muted mb-4">
                Your daily reflections, transcribed, analyzed, and transformed into personalized audio.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-reflect-muted hover:text-reflect-primary transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-reflect-muted hover:text-reflect-primary transition-colors">How It Works</a></li>
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">About</a></li>
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Blog</a></li>
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-reflect-muted text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} ReflectFlow. All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </a>
              <a href="#" className="text-reflect-muted hover:text-reflect-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
