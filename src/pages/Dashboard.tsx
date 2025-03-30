
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
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('display_name')
          .eq('auth_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          setDisplayName(data.display_name || user.email?.split('@')[0] || 'User');
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

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
