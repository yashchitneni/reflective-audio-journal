
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CalendarPlus, CalendarX, Check, LogOut, MailIcon, UserIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-database';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const { profile, loading } = useUserProfile();
  
  const [formState, setFormState] = useState({
    id: '',
    displayName: '',
    email: '',
    timezone: 'America/New_York',
    notificationPreferences: 'both',
    hasCalendar: false
  });

  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormState({
        id: profile.id,
        displayName: profile.display_name || '',
        email: profile.email || '',
        timezone: profile.timezone || 'America/New_York',
        notificationPreferences: profile.notification_preferences || 'both',
        hasCalendar: !!profile.calendar_token
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

  const connectCalendar = async () => {
    setIsUpdating(true);
    try {
      // This is a mock implementation
      // In a real app, this would call an OAuth endpoint
      
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

  const disconnectCalendar = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          calendar_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', formState.id);
      
      if (error) throw error;
      
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
              <CardTitle>Calendar Integration</CardTitle>
              <CardDescription>
                Connect your calendar to enable scheduling features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="text-base font-medium">Google Calendar</h4>
                  <p className="text-sm text-reflect-muted">
                    {formState.hasCalendar 
                      ? 'Your calendar is connected and syncing' 
                      : 'Connect your Google Calendar for event syncing'
                    }
                  </p>
                </div>
                
                {formState.hasCalendar ? (
                  <Button 
                    variant="outline" 
                    onClick={disconnectCalendar}
                    disabled={isUpdating}
                  >
                    <CalendarX className="w-4 h-4 mr-2" />
                    Disconnect
                  </Button>
                ) : (
                  <Button 
                    variant="outline" 
                    onClick={connectCalendar}
                    disabled={isUpdating}
                    className="text-reflect-primary border-reflect-primary/30 hover:bg-reflect-primary/10"
                  >
                    <CalendarPlus className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
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
