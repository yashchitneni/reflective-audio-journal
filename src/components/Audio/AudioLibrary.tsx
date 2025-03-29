
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { PlayIcon, PauseIcon, MusicIcon, RefreshCcwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Mock data for audio entries
const mockAudioEntries = [
  {
    id: '1',
    title: 'Daily Affirmation',
    date: new Date(2023, 9, 20), // October 20, 2023
    duration: 120, // in seconds
    url: 'https://example.com/audio1.mp3'
  },
  {
    id: '2',
    title: 'Stress Relief Meditation',
    date: new Date(2023, 9, 18), // October 18, 2023
    duration: 300, // in seconds
    url: 'https://example.com/audio2.mp3'
  },
  {
    id: '3',
    title: 'Morning Motivation',
    date: new Date(2023, 9, 15), // October 15, 2023
    duration: 150, // in seconds
    url: 'https://example.com/audio3.mp3'
  }
];

const AudioLibrary = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  
  const togglePlay = (id: string) => {
    if (currentlyPlaying === id) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(id);
    }
    
    // TODO: Implement actual audio playback
  };
  
  const generateNewAudio = () => {
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Audio Generated",
        description: "Your new audio reflection has been created.",
      });
    }, 3000);
    
    // TODO: Implement actual generation with Claude and ElevenLabs
  };
  
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="reflect-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MusicIcon className="w-5 h-5 text-reflect-secondary" />
          Your Audio Library
        </CardTitle>
        <CardDescription>
          Listen to your AI-generated reflections and meditations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          className="reflect-button w-full mb-4 gap-2"
          onClick={generateNewAudio}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <RefreshCcwIcon className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCcwIcon className="w-4 h-4" />
              Generate New Audio
            </>
          )}
        </Button>
        
        <div className="space-y-3 mt-4">
          {mockAudioEntries.map(audio => (
            <div 
              key={audio.id} 
              className="border rounded-md p-3 flex items-center gap-3 hover:border-reflect-primary transition-colors"
            >
              <button 
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentlyPlaying === audio.id ? 'bg-red-500' : 'bg-reflect-primary'
                }`}
                onClick={() => togglePlay(audio.id)}
              >
                {currentlyPlaying === audio.id ? (
                  <PauseIcon className="w-5 h-5 text-white" />
                ) : (
                  <PlayIcon className="w-5 h-5 text-white" />
                )}
              </button>
              
              <div className="flex-1">
                <h4 className="font-medium">{audio.title}</h4>
                <p className="text-sm text-reflect-muted">
                  {audio.date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  })} • {formatDuration(audio.duration)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudioLibrary;
