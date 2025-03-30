
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MicIcon, 
  ImageIcon, 
  SendIcon, 
  PauseIcon, 
  SquareIcon,
  LoaderIcon,
  CheckIcon
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const JournalEditor = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [entryText, setEntryText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [imageCaption, setImageCaption] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const recordingInterval = useRef<NodeJS.Timeout | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEntryText(e.target.value);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    // Start timer
    recordingInterval.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    
    // TODO: Implement actual recording with Web Audio API
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    // Clear timer
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current);
      recordingInterval.current = null;
    }
    
    // Simulate transcription process
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setAudioTranscription("This is a simulated transcription of the audio you just recorded. In a real implementation, this would be the text generated from your voice recording.");
    }, 2000);
    
    // TODO: Implement actual stop recording and transcription
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const saveEntry = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to save journal entries.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    
    // Determine which content to save based on active tab
    let textContent = null;
    let voiceTranscript = null;
    let photoUrls = null;
    let voiceAudioUrl = null;
    
    if (activeTab === 'text') {
      textContent = entryText;
    } else if (activeTab === 'voice') {
      voiceTranscript = audioTranscription;
      // In a real app, we would also save the voice file
      // voiceAudioUrl = "url/to/audio/file.mp3";
    } else if (activeTab === 'photo') {
      // In a real app, we would upload the image to storage
      // and store the URL here
      photoUrls = ["simulated_photo_url.jpg"];
      textContent = imageCaption;
    }
    
    if (!textContent && !voiceTranscript && !photoUrls) {
      toast({
        title: "Empty Entry",
        description: "Please add some text, recording, or image to your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      // First get the user ID from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();
        
      if (userError) {
        throw new Error(userError.message);
      }
      
      if (!userData) {
        throw new Error('User profile not found');
      }
      
      // Now save the journal entry
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: userData.id,
          entry_date: new Date().toISOString(),
          text_content: textContent,
          voice_transcript: voiceTranscript,
          photo_urls: photoUrls,
          voice_audio_url: voiceAudioUrl,
        })
        .select();
        
      if (error) {
        throw new Error(error.message);
      }
      
      toast({
        title: "Entry Saved",
        description: "Your journal entry has been saved successfully.",
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Error Saving Entry",
        description: error.message || "Failed to save your entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="w-full">
      <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="voice">Voice</TabsTrigger>
          <TabsTrigger value="photo">Photo</TabsTrigger>
        </TabsList>
        
        <CardContent>
          <TabsContent value="text" className="mt-0">
            <Textarea
              placeholder="What's on your mind today?"
              className="resize-none min-h-[200px] reflect-input"
              value={entryText}
              onChange={handleTextChange}
            />
          </TabsContent>
          
          <TabsContent value="voice" className="mt-0">
            <div className="min-h-[200px] flex flex-col items-center justify-center">
              {isProcessing ? (
                <div className="flex flex-col items-center text-center">
                  <LoaderIcon className="w-12 h-12 text-reflect-primary animate-spin mb-4" />
                  <p className="text-reflect-muted">Transcribing your audio...</p>
                </div>
              ) : audioTranscription ? (
                <div className="w-full">
                  <div className="mb-4 flex items-center gap-2">
                    <CheckIcon className="w-5 h-5 text-green-500" />
                    <span className="text-green-600 font-medium">Audio transcribed successfully</span>
                  </div>
                  <Textarea
                    className="resize-none min-h-[150px] reflect-input w-full"
                    value={audioTranscription}
                    onChange={e => setAudioTranscription(e.target.value)}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <button
                    onClick={toggleRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 ${
                      isRecording 
                        ? 'bg-red-500 text-white animate-pulse-gentle' 
                        : 'bg-reflect-primary text-white'
                    }`}
                  >
                    {isRecording ? (
                      <SquareIcon className="w-12 h-12" />
                    ) : (
                      <MicIcon className="w-12 h-12" />
                    )}
                  </button>
                  
                  {isRecording ? (
                    <div className="text-red-500 font-semibold text-xl">
                      {formatTime(recordingTime)}
                    </div>
                  ) : (
                    <p className="text-reflect-muted">Tap to start recording</p>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="photo" className="mt-0">
            <div className="min-h-[200px] flex flex-col items-center justify-center">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload}
              />
              
              {imagePreview ? (
                <div className="w-full">
                  <div className="relative w-full aspect-video mb-4">
                    <img 
                      src={imagePreview} 
                      alt="Selected" 
                      className="w-full h-full object-cover rounded-md"
                    />
                    <Button 
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setImageCaption('');
                      }}
                      variant="destructive" 
                      size="sm"
                      className="absolute top-2 right-2"
                    >
                      Remove
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Add a caption or notes about this image..."
                    className="resize-none reflect-input w-full"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                  />
                </div>
              ) : (
                <button
                  onClick={triggerImageUpload}
                  className="border-2 border-dashed border-gray-300 rounded-md p-8 w-full flex flex-col items-center text-reflect-muted hover:text-reflect-primary hover:border-reflect-primary transition-colors"
                >
                  <ImageIcon className="w-12 h-12 mb-2" />
                  <p className="font-medium">Click to upload an image</p>
                  <p className="text-sm">PNG, JPG or GIF</p>
                </button>
              )}
            </div>
          </TabsContent>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button 
            className="reflect-button" 
            onClick={saveEntry}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SendIcon className="w-4 h-4 mr-2" />
                Save Entry
              </>
            )}
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default JournalEditor;
