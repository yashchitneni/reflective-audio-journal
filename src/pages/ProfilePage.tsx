import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { 
  CalendarCheck, 
  CalendarPlus, 
  CalendarX, 
  Check, 
  LogOut, 
  MailIcon, 
  RefreshCw, 
  UserIcon 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-database';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { format, parseISO } from 'date-fns';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserProfile();
  const { 
    connectCalendar: connectGoogleCalendar, 
    disconnectCalendar: disconnectGoogleCalendar, 
    syncCalendarEvents, 
    isLoading: isCalendarLoading, 
    isSyncing 
  } = useGoogleCalendar();
  
  const [formState, setFormState] = useState({
    id: '',
    displayName: '',
    email: '',
    timezone: 'America/New_York',
    notificationPreferences: 'both',
    hasCalendar: false,
    lastSyncTime: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [calendarConnectedParam, setCalendarConnectedParam] = useState(false);

  useEffect(() => {
    // Check for URL parameters that indicate calendar connection success
    const urlParams = new URLSearchParams(window.location.search);
    const calendarConnected = urlParams.get('calendarConnected');
    
    if (calendarConnected === 'true') {
      setCalendarConnectedParam(true);
      // Clear the URL parameter
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Show success toast
      toast({
        title: "Calendar connected",
        description: "Your Google Calendar has been connected successfully. Syncing events now."
      });
      
      // Sync calendar events after a successful connection
      setTimeout(() => {
        syncCalendarEvents();
      }, 1000);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormState({
        id: profile.id,
        displayName: profile.display_name || '',
        email: profile.email || '',
        timezone: profile.timezone || 'America/New_York',
        notificationPreferences: profile.notification_preferences || 'both',
        hasCalendar: !!profile.calendar_token,
        lastSyncTime: profile.updated_at || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: formState.displayName,
          email: formState.email,
          timezone: formState.timezone,
          notification_preferences: formState.notificationPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', formState.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "There was an error updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Custom connect calendar function that includes console logs
  const connectCalendar = async () => {
    console.log('Connect Calendar button clicked');
    // If we have a real Google Calendar integration, use that
    if (connectGoogleCalendar) {
      await connectGoogleCalendar();
      return;
    }

    // Fallback to mock implementation
    setIsUpdating(true);
    try {
      console.log('Starting mock Google Calendar OAuth flow');
      
      // Fetch mock calendar events to populate the calendar
      const mockEvents = [
        {
          user_id: formState.id,
          event_title: 'Team Meeting',
          start_time: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          end_time: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
          location: 'Conference Room A',
          description: 'Weekly team sync-up',
          calendar_id: 'primary'
        },
        {
          user_id: formState.id,
          event_title: 'Lunch with Client',
          start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          end_time: new Date(Date.now() + 90000000).toISOString(), // Tomorrow + 1 hour
          location: 'Downtown Café',
          description: 'Project discussion over lunch',
          calendar_id: 'primary'
        },
        {
          user_id: formState.id,
          event_title: 'Product Review',
          start_time: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
          end_time: new Date(Date.now() + 180000000).toISOString(), // 2 days + 2 hours
          location: 'Main Office',
          description: 'Quarterly product review',
          calendar_id: 'primary'
        }
      ];
      
      console.log('Creating mock calendar events:', mockEvents);
      
      // First save the mock token
      const mockToken = {
        access_token: "mock-google-calendar-access-token",
        refresh_token: "mock-google-calendar-refresh-token",
        expiry_date: new Date(Date.now() + 3600000).toISOString() // 1 hour from now
      };
      
      const { error } = await supabase
        .from('users')
        .update({
          calendar_token: mockToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', formState.id);
      
      if (error) throw error;
      console.log('Calendar token saved successfully');
      
      // Then insert the mock events
      for (const event of mockEvents) {
        const { error: eventError } = await supabase
          .from('calendar_events')
          .insert(event);
          
        if (eventError) {
          console.error('Error creating mock event:', eventError);
        }
      }
      
      console.log('Mock calendar events created successfully');
      
      setFormState(prev => ({
        ...prev,
        hasCalendar: true
      }));
      
      toast({
        title: "Calendar connected",
        description: "Your calendar has been connected successfully."
      });
    } catch (error: any) {
      console.error('Error connecting calendar:', error);
      toast({
        title: "Connection failed",
        description: error.message || "Failed to connect calendar.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Custom disconnect calendar function that includes console logs
  const disconnectCalendar = async () => {
    console.log('Disconnect Calendar button clicked');
    // If we have a real Google Calendar integration, use that
    if (disconnectGoogleCalendar) {
      await disconnectGoogleCalendar();
      return;
    }

    // Fallback to mock implementation
    setIsUpdating(true);
    try {
      console.log('Removing calendar integration');
      
      // First delete all calendar events for this user
      const { error: deleteError } = await supabase
        .from('calendar_events')
        .delete()
        .eq('user_id', formState.id);
        
      if (deleteError) {
        console.error('Error deleting calendar events:', deleteError);
        throw deleteError;
      }
      
      console.log('Calendar events deleted successfully');
      
      // Then remove the token
      const { error } = await supabase
        .from('users')
        .update({
          calendar_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', formState.id);
      
      if (error) throw error;
      console.log('Calendar token removed successfully');
      
      setFormState(prev => ({
        ...prev,
        hasCalendar: false
      }));
      
      toast({
        title: "Calendar disconnected",
        description: "Your calendar has been disconnected."
      });
    } catch (error: any) {
      console.error('Error disconnecting calendar:', error);
      toast({
        title: "Disconnection failed",
        description: error.message || "Failed to disconnect calendar.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out",
        description: "You have been signed out successfully."
      });
    } catch (error: any) {
      console.error('Error signing out:', error);
      toast({
        title: "Sign out failed",
        description: error.message || "There was an error signing you out.",
        variant: "destructive"
      });
    }
  };

  const formatLastSyncTime = () => {
    if (!formState.lastSyncTime) return 'Never';
    
    try {
      const date = parseISO(formState.lastSyncTime);
      return format(date, "MMMM d, yyyy 'at' h:mm a");
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-reflect-muted">Loading your profile...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="font-heading text-3xl font-bold mb-6">Profile Settings</h1>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <UserIcon className="w-4 h-4 text-reflect-muted" />
                      </div>
                      <Input
                        id="displayName"
                        name="displayName"
                        value={formState.displayName}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <MailIcon className="w-4 h-4 text-reflect-muted" />
                      </div>
                      <Input
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        placeholder="Your email"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={formState.timezone}
                      onValueChange={(value) => handleSelectChange('timezone', value)}
                    >
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Notification Preferences</Label>
                    <RadioGroup 
                      value={formState.notificationPreferences}
                      onValueChange={(value) => handleSelectChange('notificationPreferences', value)}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="email" id="notif-email" />
                        <Label htmlFor="notif-email" className="font-normal">Email only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="push" id="notif-push" />
                        <Label htmlFor="notif-push" className="font-normal">Push notifications only</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="both" id="notif-both" />
                        <Label htmlFor="notif-both" className="font-normal">Both email and push</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
                
                <Button type="submit" className="reflect-button" disabled={isUpdating}>
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Google Calendar Integration</CardTitle>
              <CardDescription>
                Connect your Google Calendar to view your events alongside journal entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="space-y-1">
                    <h4 className="text-base font-medium">Google Calendar</h4>
                    <p className="text-sm text-reflect-muted">
                      {formState.hasCalendar 
                        ? 'Your calendar is connected and syncing' 
                        : 'Connect your Google Calendar for event integration'
                      }
                    </p>
                    
                    {formState.hasCalendar && (
                      <p className="text-xs text-reflect-muted mt-1">
                        Last sync: {formatLastSyncTime()}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {formState.hasCalendar ? (
                      <>
                        <Button 
                          variant="outline" 
                          onClick={syncCalendarEvents}
                          disabled={isSyncing || isCalendarLoading}
                          className="text-reflect-primary border-reflect-primary/30 hover:bg-reflect-primary/10"
                        >
                          <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                          {isSyncing ? 'Syncing...' : 'Sync Now'}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          onClick={disconnectCalendar}
                          disabled={isSyncing || isCalendarLoading}
                        >
                          <CalendarX className="w-4 h-4 mr-2" />
                          Disconnect
                        </Button>
                      </>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={connectCalendar}
                        disabled={isCalendarLoading}
                        className="text-reflect-primary border-reflect-primary/30 hover:bg-reflect-primary/10"
                      >
                        <CalendarPlus className="w-4 h-4 mr-2" />
                        {isCalendarLoading ? 'Connecting...' : 'Connect Calendar'}
                      </Button>
                    )}
                  </div>
                </div>
                
                {formState.hasCalendar && (
                  <div className="rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CalendarCheck className="h-5 w-5 text-green-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Calendar Connected</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>Your Google Calendar is connected. Calendar events will appear in your calendar view alongside journal entries.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {!formState.hasCalendar && (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <CalendarPlus className="h-5 w-5 text-blue-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Connect Your Calendar</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>Connect your Google Calendar to see your events alongside your journal entries. This helps provide context to your reflections.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
              <CardDescription>
                Manage your account settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;