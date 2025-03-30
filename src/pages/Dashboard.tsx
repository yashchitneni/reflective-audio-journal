
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import JournalPrompt from '@/components/Journal/JournalPrompt';
import RecentEntries from '@/components/Journal/RecentEntries';
import CalendarView from '@/components/Calendar/CalendarView';
import AudioLibrary from '@/components/Audio/AudioLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { getUserByAuthId } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { UserProfile } from '@/types/models';

const Dashboard = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      console.log('No user found in Dashboard, redirecting to login');
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      console.log('Fetching user profile for:', user.id);
      setIsLoading(true);
      try {
        // Use the helper function to get user profile
        const userProfile = await getUserByAuthId(user.id);

        if (userProfile) {
          console.log('User profile found:', userProfile);
          setDisplayName(userProfile.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
        } else {
          console.log('No user profile found, using fallback name');
          setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
        // Fall back to metadata
        setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-reflect-muted">Loading your dashboard...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold mb-2">
          Welcome back, <span className="reflect-gradient-text">{displayName}</span>
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
