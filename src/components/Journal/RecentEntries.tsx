
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { FileTextIcon, MicIcon, ImageIcon, PlusCircleIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

// Define types for journal entries
export type EntryType = 'text' | 'voice' | 'photo' | 'mixed';

export interface JournalEntry {
  id: string;
  entry_date: string;
  text_content: string | null;
  voice_transcript: string | null;
  photo_urls: string[] | null;
  type: EntryType;
  preview: string;
}

const RecentEntries = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserIdAndEntries = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        // First, get the user's internal ID from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();
        
        if (userError) {
          console.error('Error fetching user ID:', userError);
          setIsLoading(false);
          return;
        }
        
        if (!userData) {
          console.error('No user found with auth_id:', user.id);
          setIsLoading(false);
          return;
        }
        
        setUserId(userData.id);
        
        // Now fetch the journal entries using the user's internal ID
        const { data: entriesData, error: entriesError } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userData.id)
          .order('entry_date', { ascending: false })
          .limit(3);
        
        if (entriesError) {
          console.error('Error fetching journal entries:', entriesError);
          setIsLoading(false);
          return;
        }
        
        if (!entriesData || entriesData.length === 0) {
          // If there are no entries, set an empty array
          setEntries([]);
          setIsLoading(false);
          return;
        }
        
        // Process the entries to match our JournalEntry interface
        const processedEntries: JournalEntry[] = entriesData.map(entry => {
          // Determine the entry type
          let type: EntryType = 'text';
          if (entry.voice_transcript && entry.text_content) {
            type = 'mixed';
          } else if (entry.voice_transcript) {
            type = 'voice';
          } else if (entry.photo_urls && 
                    (Array.isArray(entry.photo_urls) ? 
                      entry.photo_urls.length > 0 : 
                      Object.keys(entry.photo_urls).length > 0)) {
            type = 'photo';
          }
          
          // Create a preview of the content
          let preview = '';
          if (entry.text_content) {
            preview = entry.text_content.substring(0, 100) + (entry.text_content.length > 100 ? '...' : '');
          } else if (entry.voice_transcript) {
            preview = entry.voice_transcript.substring(0, 100) + (entry.voice_transcript.length > 100 ? '...' : '');
          } else {
            preview = 'View this entry...';
          }
          
          return {
            id: entry.id,
            entry_date: entry.entry_date,
            text_content: entry.text_content,
            voice_transcript: entry.voice_transcript,
            photo_urls: Array.isArray(entry.photo_urls) ? entry.photo_urls : null,
            type,
            preview
          };
        });
        
        setEntries(processedEntries);
      } catch (error) {
        console.error('Error in fetchUserIdAndEntries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserIdAndEntries();
  }, [user]);
  
  const getEntryTypeIcon = (type: EntryType) => {
    switch (type) {
      case 'text':
        return <FileTextIcon className="w-4 h-4 text-blue-500" />;
      case 'voice':
        return <MicIcon className="w-4 h-4 text-green-500" />;
      case 'photo':
        return <ImageIcon className="w-4 h-4 text-purple-500" />;
      case 'mixed':
        return <FileTextIcon className="w-4 h-4 text-orange-500" />;
      default:
        return <FileTextIcon className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <Card className="reflect-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Journal Entries</CardTitle>
          <CardDescription>Your latest reflections</CardDescription>
        </div>
        <Link to="/new-entry">
          <Button className="reflect-button-secondary" size="sm">
            <PlusCircleIcon className="w-4 h-4 mr-1" /> New Entry
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">Loading entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="bg-reflect-accent/10 rounded-md p-6 text-center">
            <h3 className="text-xl font-medium mb-2">No entries yet</h3>
            <p className="text-reflect-muted mb-4">
              Start capturing your thoughts, voice notes, or images
            </p>
            <Link to="/new-entry">
              <Button className="reflect-button">
                Create Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link key={entry.id} to={`/journal/${entry.id}`}>
                <div className="border rounded-md p-4 hover:bg-reflect-accent/5 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    {getEntryTypeIcon(entry.type)}
                    <span className="text-sm text-reflect-muted">
                      {entry.entry_date ? format(parseISO(entry.entry_date), 'MMM d, yyyy • h:mm a') : 'Unknown date'}
                    </span>
                  </div>
                  <p className="line-clamp-2">{entry.preview}</p>
                </div>
              </Link>
            ))}
            
            <Link to="/journal" className="block text-center mt-4">
              <Button variant="link" className="text-reflect-primary">
                View All Entries
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
