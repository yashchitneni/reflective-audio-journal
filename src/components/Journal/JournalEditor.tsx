
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  MicIcon, 
  ImageIcon, 
  SendIcon, 
  PauseIcon, 
  StopIcon,
  LoaderIcon,
  CheckIcon
} from 'lucide-react';
import { 
  Card,
  CardContent,
  CardFooter
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const JournalEditor = () => {
  const [activeTab, setActiveTab] = useState('text');
  const [entryText, setEntryText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioTranscription, setAudioTranscription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  let recordingInterval = useRef<NodeJS.Timeout | null>(null);

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

  const saveEntry = () => {
    // Determine which content to save based on active tab
    let content = '';
    if (activeTab === 'text') {
      content = entryText;
    } else if (activeTab === 'voice') {
      content = audioTranscription;
    }
    
    if (!content && !selectedImage) {
      toast({
        title: "Empty Entry",
        description: "Please add some text, recording, or image to your journal entry.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Entry Saved",
      description: "Your journal entry has been saved successfully.",
    });
    
    // TODO: Implement actual saving to backend
    console.log("Saving entry:", { content, hasImage: !!selectedImage });
    
    // Redirect to dashboard or entry view page
    // window.location.href = '/dashboard';
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
                      <StopIcon className="w-12 h-12" />
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
          <Button variant="outline" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button className="reflect-button" onClick={saveEntry}>
            <SendIcon className="w-4 h-4 mr-2" />
            Save Entry
          </Button>
        </CardFooter>
      </Tabs>
    </Card>
  );
};

export default JournalEditor;
