
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import JournalPrompt from '@/components/Journal/JournalPrompt';
import RecentEntries from '@/components/Journal/RecentEntries';
import CalendarView from '@/components/Calendar/CalendarView';
import AudioLibrary from '@/components/Audio/AudioLibrary';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

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
        // First try to get user from the users table using auth_id
        const { data, error } = await supabase
          .from('users')
          .select('id, display_name, email')
          .eq('auth_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          // If we can't find the user in our database, fall back to auth metadata
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
          setDisplayName(name);
          return;
        }

        if (data) {
          console.log('User profile found:', data);
          setDisplayName(data.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User');
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
