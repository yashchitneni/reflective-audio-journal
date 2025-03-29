
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  PlayIcon, 
  PauseIcon, 
  RefreshCwIcon, 
  SearchIcon,
  MusicIcon,
  HeadphonesIcon,
  BrainIcon,
  HeartIcon,
  SunIcon,
  MoonIcon,
  CloudIcon
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock data for audio entries
const mockAudioEntries = [
  {
    id: '1',
    title: 'Daily Affirmation',
    date: new Date(2023, 9, 20), // October 20, 2023
    duration: 120, // in seconds
    url: 'https://example.com/audio1.mp3',
    category: 'affirmation'
  },
  {
    id: '2',
    title: 'Stress Relief Meditation',
    date: new Date(2023, 9, 18), // October 18, 2023
    duration: 300, // in seconds
    url: 'https://example.com/audio2.mp3',
    category: 'meditation'
  },
  {
    id: '3',
    title: 'Morning Motivation',
    date: new Date(2023, 9, 15), // October 15, 2023
    duration: 150, // in seconds
    url: 'https://example.com/audio3.mp3',
    category: 'motivation'
  },
  {
    id: '4',
    title: 'Evening Reflection',
    date: new Date(2023, 9, 12), // October 12, 2023
    duration: 180, // in seconds
    url: 'https://example.com/audio4.mp3',
    category: 'reflection'
  },
  {
    id: '5',
    title: 'Mindfulness Exercise',
    date: new Date(2023, 9, 10), // October 10, 2023
    duration: 240, // in seconds
    url: 'https://example.com/audio5.mp3',
    category: 'meditation'
  },
  {
    id: '6',
    title: 'Gratitude Practice',
    date: new Date(2023, 9, 8), // October 8, 2023
    duration: 135, // in seconds
    url: 'https://example.com/audio6.mp3',
    category: 'affirmation'
  },
];

const AudioLibraryPage = () => {
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
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
  
  // Filter audio entries based on search and category
  const filteredAudioEntries = mockAudioEntries.filter(audio => {
    const matchesSearch = audio.title.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && audio.category === activeTab;
  });
  
  // Get icon based on category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'affirmation':
        return <SunIcon className="w-5 h-5 text-yellow-500" />;
      case 'meditation':
        return <CloudIcon className="w-5 h-5 text-blue-400" />;
      case 'motivation':
        return <BrainIcon className="w-5 h-5 text-purple-500" />;
      case 'reflection':
        return <MoonIcon className="w-5 h-5 text-indigo-500" />;
      default:
        return <HeadphonesIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Audio Library</h1>
        <p className="text-reflect-muted">
          Listen to your personalized audio reflections and meditations
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-xl">Generate</CardTitle>
            <CardDescription>Create new audio content</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="reflect-button w-full gap-2"
              onClick={generateNewAudio}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCwIcon className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCwIcon className="w-4 h-4" />
                  Generate New Audio
                </>
              )}
            </Button>
            
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-reflect-muted">Categories</h3>
              <div className="space-y-2">
                <Button 
                  variant={activeTab === 'all' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('all')}
                >
                  <HeadphonesIcon className="w-4 h-4 mr-2" />
                  All Audio
                </Button>
                <Button 
                  variant={activeTab === 'affirmation' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('affirmation')}
                >
                  <SunIcon className="w-4 h-4 mr-2" />
                  Affirmations
                </Button>
                <Button 
                  variant={activeTab === 'meditation' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('meditation')}
                >
                  <CloudIcon className="w-4 h-4 mr-2" />
                  Meditations
                </Button>
                <Button 
                  variant={activeTab === 'motivation' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('motivation')}
                >
                  <BrainIcon className="w-4 h-4 mr-2" />
                  Motivations
                </Button>
                <Button 
                  variant={activeTab === 'reflection' ? 'default' : 'outline'} 
                  className="w-full justify-start" 
                  onClick={() => setActiveTab('reflection')}
                >
                  <MoonIcon className="w-4 h-4 mr-2" />
                  Reflections
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <MusicIcon className="w-5 h-5 text-reflect-secondary" />
                Your Audio Library
              </CardTitle>
              
              <div className="relative w-full md:w-64">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-reflect-muted h-4 w-4" />
                <Input
                  placeholder="Search audio..."
                  className="pl-9 reflect-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="affirmation">Affirmations</TabsTrigger>
                <TabsTrigger value="meditation">Meditations</TabsTrigger>
                <TabsTrigger value="motivation">Motivations</TabsTrigger>
                <TabsTrigger value="reflection">Reflections</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-0">
                <div className="grid grid-cols-1 gap-3">
                  {filteredAudioEntries.length > 0 ? (
                    filteredAudioEntries.map(audio => (
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
                          <div className="flex items-center gap-2">
                            {getCategoryIcon(audio.category)}
                            <h4 className="font-medium">{audio.title}</h4>
                          </div>
                          <p className="text-sm text-reflect-muted">
                            {audio.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {formatDuration(audio.duration)}
                          </p>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <HeartIcon className="w-5 h-5 text-reflect-muted hover:text-red-500 transition-colors" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <HeadphonesIcon className="w-12 h-12 text-reflect-muted mx-auto mb-4" />
                      <p className="text-reflect-muted">No audio entries found.</p>
                      <p className="text-sm text-reflect-muted mt-1">
                        Try adjusting your search or generate new audio.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Repeat similar structure for other tabs */}
              <TabsContent value="affirmation" className="mt-0">
                <div className="grid grid-cols-1 gap-3">
                  {filteredAudioEntries.length > 0 ? (
                    filteredAudioEntries.map(audio => (
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
                          <div className="flex items-center gap-2">
                            <SunIcon className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-medium">{audio.title}</h4>
                          </div>
                          <p className="text-sm text-reflect-muted">
                            {audio.date.toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })} • {formatDuration(audio.duration)}
                          </p>
                        </div>
                        
                        <Button variant="ghost" size="icon">
                          <HeartIcon className="w-5 h-5 text-reflect-muted hover:text-red-500 transition-colors" />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <SunIcon className="w-12 h-12 text-yellow-500/50 mx-auto mb-4" />
                      <p className="text-reflect-muted">No affirmations found.</p>
                      <Button 
                        className="reflect-button gap-2 mt-4"
                        onClick={generateNewAudio}
                        disabled={isGenerating}
                      >
                        {isGenerating ? 'Generating...' : 'Generate Affirmation'}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Similar structure for the remaining tabs */}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AudioLibraryPage;
