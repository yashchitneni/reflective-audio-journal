
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { JournalEntry } from '@/types/models';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Mic, Image } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

const JournalEntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    const fetchEntry = async () => {
      try {
        setLoading(true);
        
        // First get the user's profile to get their internal ID
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();

        if (userError) throw userError;
        
        if (!userData) {
          throw new Error('User profile not found');
        }

        // Then get the specific journal entry
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userData.id)
          .eq('id', entryId)
          .single();

        if (error) throw error;
        
        if (!data) {
          throw new Error('Entry not found');
        }
        
        setEntry(data as JournalEntry);
      } catch (e) {
        console.error('Error fetching journal entry:', e);
        setError(e as Error);
        toast({
          title: "Error",
          description: "Could not load the journal entry. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [user, entryId, navigate]);

  const handleBack = () => {
    navigate('/journal');
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-reflect-muted">Loading entry...</p>
        </div>
      </MainLayout>
    );
  }

  if (error || !entry) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <h2 className="text-xl font-medium">Entry not found</h2>
          <p className="text-reflect-muted">We couldn't find the journal entry you're looking for.</p>
          <Button onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Journal
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <h1 className="font-heading text-2xl font-bold">
          {format(new Date(entry.entry_date), 'EEEE, MMMM d, yyyy')}
        </h1>
      </div>
      
      <div className="flex gap-2 mb-4">
        {entry.text_content && <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"><FileText className="w-3 h-3" /> Text</div>}
        {entry.voice_transcript && <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"><Mic className="w-3 h-3" /> Voice</div>}
        {entry.photo_urls && entry.photo_urls.length > 0 && <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"><Image className="w-3 h-3" /> Photos</div>}
      </div>

      <div className="space-y-6">
        {entry.text_content && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-3">Written Entry</h2>
            <div className="whitespace-pre-wrap">{entry.text_content}</div>
          </div>
        )}
        
        {entry.voice_transcript && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-3">Voice Entry</h2>
            <div className="whitespace-pre-wrap">{entry.voice_transcript}</div>
            {entry.voice_audio_url && (
              <div className="mt-4">
                <h3 className="text-sm font-medium mb-2">Audio Recording</h3>
                <audio controls className="w-full">
                  <source src={entry.voice_audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
        
        {entry.photo_urls && entry.photo_urls.length > 0 && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-3">Photos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(entry.photo_urls as string[]).map((url, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden">
                  <img 
                    src={url} 
                    alt={`Journal photo ${index + 1}`} 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default JournalEntryPage;
