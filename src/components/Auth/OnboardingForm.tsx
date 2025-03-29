
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { AlertCircleIcon } from 'lucide-react';

const OnboardingForm = () => {
  const [timezone, setTimezone] = useState('America/New_York');
  const [enablePush, setEnablePush] = useState(true);
  const [enableEmail, setEnableEmail] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // TODO: Implement actual profile setup with Supabase
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, just navigate to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Could not save settings. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 text-red-600 rounded-md flex items-center gap-2">
            <AlertCircleIcon className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}
        
        {step === 1 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Tell us about yourself</h3>
            <p className="text-reflect-muted mb-6">
              Let's personalize your ReflectFlow experience.
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timezone">Your Timezone</Label>
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
              
              <Button 
                type="button" 
                className="reflect-button w-full mt-6"
                onClick={() => setStep(2)}
              >
                Continue
              </Button>
            </div>
          </>
        )}
        
        {step === 2 && (
          <>
            <h3 className="text-xl font-semibold mb-4">Notification Preferences</h3>
            <p className="text-reflect-muted mb-6">
              How would you like to receive your daily reflection reminders?
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-notifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-reflect-muted">Receive notifications in your browser</p>
                </div>
                <Switch 
                  id="push-notifications"
                  checked={enablePush}
                  onCheckedChange={setEnablePush}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications" className="font-medium">Email Reminders</Label>
                  <p className="text-sm text-reflect-muted">Get daily prompts in your inbox</p>
                </div>
                <Switch 
                  id="email-notifications"
                  checked={enableEmail}
                  onCheckedChange={setEnableEmail}
                />
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button 
                  type="button" 
                  className="reflect-button-secondary flex-1"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="reflect-button flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Finish Setup'}
                </Button>
              </div>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default OnboardingForm;
