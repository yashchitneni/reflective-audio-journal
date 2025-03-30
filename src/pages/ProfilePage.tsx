import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  UserIcon, 
  BellIcon, 
  CalendarIcon, 
  LogOutIcon,
  SaveIcon,
  CheckIcon,
  BrainIcon
} from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const { user, signOut } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
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
          .select('*')
          .eq('auth_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
          return;
        }

        if (data) {
          setUserId(data.id);
          setName(data.display_name || '');
          setEmail(data.email || user.email || '');
          setTimezone(data.timezone || 'America/New_York');
          
          // Parse notification preferences
          const notifPrefs = data.notification_preferences || 'both';
          setPushNotifications(notifPrefs.includes('push') || notifPrefs === 'both');
          setEmailNotifications(notifPrefs.includes('email') || notifPrefs === 'both');
          
          // Check if calendar is connected
          setIsConnected(!!data.calendar_token);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    };

    fetchUserProfile();
  }, [user, navigate]);

  const handleSaveProfile = async () => {
    if (!userId) return;
    
    setIsSaving(true);
    
    // Determine notification preferences
    let notificationPreferences = 'none';
    if (pushNotifications && emailNotifications) notificationPreferences = 'both';
    else if (pushNotifications) notificationPreferences = 'push';
    else if (emailNotifications) notificationPreferences = 'email';
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          display_name: name,
          email: email,
          timezone: timezone,
          notification_preferences: notificationPreferences,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleConnectCalendar = async () => {
    // In a real implementation, this would connect to Google Calendar API
    // For now, we'll just simulate connecting by saving a token in the database
    if (!userId) return;
    
    try {
      const mockToken = { 
        access_token: "mock_access_token", 
        refresh_token: "mock_refresh_token",
        expiry_date: new Date(Date.now() + 3600000).toISOString()
      };
      
      const { error } = await supabase
        .from('users')
        .update({
          calendar_token: mockToken,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      setIsConnected(true);
      toast({
        title: "Calendar Connected",
        description: "Your Google Calendar has been connected successfully.",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect your calendar. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleDisconnectCalendar = async () => {
    if (!userId) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .update({
          calendar_token: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      setIsConnected(false);
      toast({
        title: "Calendar Disconnected",
        description: "Your Google Calendar has been disconnected.",
      });
    } catch (error: any) {
      toast({
        title: "Disconnection Failed",
        description: error.message || "Could not disconnect your calendar. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleLogout = () => {
    signOut();
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Profile Settings</h1>
        <p className="text-reflect-muted">
          Manage your account preferences
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <UserIcon className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <BellIcon className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Integrations
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal details and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    className="reflect-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    className="reflect-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={!!user?.email}
                  />
                  {user?.email && (
                    <p className="text-xs text-reflect-muted mt-1">Email is managed by your authentication provider</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger className="reflect-input">
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                      <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                      <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t">
                <Button variant="outline" onClick={handleLogout} className="flex items-center gap-2">
                  <LogOutIcon className="w-4 h-4" />
                  Sign Out
                </Button>
                
                <Button 
                  className="reflect-button flex items-center gap-2"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <SaveIcon className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Configure how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-reflect-muted">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <Switch
                    checked={pushNotifications}
                    onCheckedChange={setPushNotifications}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Email Notifications</Label>
                    <p className="text-sm text-reflect-muted">
                      Receive daily journal reminders via email
                    </p>
                  </div>
                  <Switch
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <div className="pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Notification Schedule</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reminder-time">Daily Reminder Time</Label>
                      <Select defaultValue="8pm">
                        <SelectTrigger className="reflect-input">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6am">6:00 AM</SelectItem>
                          <SelectItem value="7am">7:00 AM</SelectItem>
                          <SelectItem value="8am">8:00 AM</SelectItem>
                          <SelectItem value="9am">9:00 AM</SelectItem>
                          <SelectItem value="6pm">6:00 PM</SelectItem>
                          <SelectItem value="7pm">7:00 PM</SelectItem>
                          <SelectItem value="8pm">8:00 PM</SelectItem>
                          <SelectItem value="9pm">9:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Event-based Reminders</Label>
                        <p className="text-sm text-reflect-muted">
                          Get prompts before calendar events
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end items-center pt-4 border-t">
                <Button 
                  className="reflect-button flex items-center gap-2"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <SaveIcon className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>Connected Services</CardTitle>
              <CardDescription>
                Link your accounts to enhance your experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="bg-white p-2 rounded shadow">
                      <CalendarIcon className="w-8 h-8 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg">Google Calendar</h3>
                      <p className="text-sm text-reflect-muted">
                        Connect your calendar to get personalized journal prompts based on your upcoming events.
                      </p>
                    </div>
                  </div>
                  
                  {isConnected ? (
                    <div className="flex items-center gap-2">
                      <span className="flex items-center text-green-600 text-sm gap-1">
                        <CheckIcon className="w-4 h-4" />
                        Connected
                      </span>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={handleDisconnectCalendar}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      className="reflect-button-secondary"
                      onClick={handleConnectCalendar}
                    >
                      Connect
                    </Button>
                  )}
                </div>
                
                {isConnected && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2 text-sm">Connected Account</h4>
                    <p className="text-reflect-muted text-sm">{email}</p>
                    
                    <div className="mt-3">
                      <Label htmlFor="sync-frequency" className="text-sm">Sync Frequency</Label>
                      <Select defaultValue="daily">
                        <SelectTrigger className="reflect-input mt-1">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Future integration placeholders */}
              <div className="border border-dashed rounded-lg p-4 bg-gray-50">
                <div className="flex items-start gap-3">
                  <div className="bg-white p-2 rounded shadow">
                    <BrainIcon className="w-8 h-8 text-purple-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">More Integrations Coming Soon</h3>
                    <p className="text-sm text-reflect-muted">
                      We're working on integrating with more services to enhance your journaling experience.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
};

export default ProfilePage;
