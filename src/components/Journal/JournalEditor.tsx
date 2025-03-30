
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Camera, Mic, Send, Image, X, Save } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/use-database';
import { toast } from '@/hooks/use-toast';

const JournalEditor = () => {
  const [text, setText] = useState('');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useUserProfile();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Mock recording start
      toast({
        title: "Recording started",
        description: "Your voice is being recorded...",
      });
      setTimeout(() => {
        setIsRecording(false);
        setVoiceTranscript("This is a simulated voice transcript. In a real application, this would be the result of speech-to-text conversion.");
        toast({
          title: "Recording completed",
          description: "Your voice has been transcribed.",
        });
      }, 3000);
    } else {
      // Mock recording stop
      toast({
        title: "Recording stopped",
        description: "Recording has been cancelled.",
      });
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Mock photo upload
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const saveEntry = async () => {
    if (!text && !voiceTranscript && photos.length === 0) {
      toast({
        title: "Cannot save empty entry",
        description: "Please add some text, voice recording, or photos before saving.",
        variant: "destructive",
      });
      return;
    }

    if (!user || !profile) {
      toast({
        title: "Not logged in",
        description: "You must be logged in to save a journal entry.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: profile.id,
          entry_date: new Date().toISOString(),
          text_content: text || null,
          voice_transcript: voiceTranscript || null,
          photo_urls: photos.length > 0 ? photos : null,
          voice_audio_url: null // In a real app, this would be the URL to the stored audio file
        })
        .select('id')
        .single();

      if (error) throw error;

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });

      navigate('/journal');
    } catch (error: any) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Failed to save entry",
        description: error.message || "There was an error saving your journal entry.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <Textarea
            placeholder="What's on your mind today?"
            value={text}
            onChange={handleTextChange}
            className="min-h-[200px] text-lg resize-none border-0 focus-visible:ring-0 p-0"
          />
        </CardContent>
      </Card>

      {voiceTranscript && (
        <Card className="border-reflect-primary border-opacity-50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <Mic className="w-5 h-5 text-reflect-primary mt-1 mr-2 shrink-0" />
              <div>
                <h3 className="text-sm font-medium mb-1">Voice Note Transcript</h3>
                <p className="text-reflect-text">{voiceTranscript}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {photos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <img
                src={photo}
                alt={`Uploaded image ${index + 1}`}
                className="rounded-md w-full h-40 object-cover"
              />
              <button
                className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removePhoto(index)}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            type="button"
            size="sm"
            variant={isRecording ? "destructive" : "outline"}
            onClick={toggleRecording}
          >
            <Mic className={`mr-1 h-4 w-4 ${isRecording ? 'animate-pulse' : ''}`} />
            {isRecording ? 'Stop Recording' : 'Record Voice'}
          </Button>

          <label>
            <Button type="button" size="sm" variant="outline" className="cursor-pointer" asChild>
              <div>
                <Image className="mr-1 h-4 w-4" />
                Add Photos
              </div>
            </Button>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => navigate('/journal')}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={saveEntry}
            disabled={isSaving}
            className="reflect-button"
          >
            {isSaving ? (
              <>
                <Save className="mr-1 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="mr-1 h-4 w-4" />
                Save Entry
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JournalEditor;
