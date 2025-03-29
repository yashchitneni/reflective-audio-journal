
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import JournalPrompt from '@/components/Journal/JournalPrompt';
import RecentEntries from '@/components/Journal/RecentEntries';
import CalendarView from '@/components/Calendar/CalendarView';
import AudioLibrary from '@/components/Audio/AudioLibrary';

const Dashboard = () => {
  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">
          Welcome back, <span className="reflect-gradient-text">Sarah</span>
        </h1>
        <p className="text-reflect-muted">
          Today is {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JournalPrompt />
        <RecentEntries />
        <CalendarView />
        <AudioLibrary />
      </div>
    </MainLayout>
  );
};

export default Dashboard;
