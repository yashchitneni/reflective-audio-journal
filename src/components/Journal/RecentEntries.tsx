
import React, { useEffect, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { BookIcon, FileTextIcon, MicIcon, ImageIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type EntryType = 'text' | 'voice' | 'photo';

interface JournalEntry {
  id: string;
  entry_date: string;
  text_content: string | null;
  voice_transcript: string | null;
  photo_urls: string[] | null;
  type: EntryType;
  preview: string;
}

const RecentEntries = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        // First get the user ID from the users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', user.id)
          .single();
          
        if (userError) {
          console.error('Error fetching user:', userError);
          setIsLoading(false);
          return;
        }
        
        if (!userData) {
          console.log('No user found');
          setIsLoading(false);
          return;
        }
        
        // Fetch the journal entries
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .eq('user_id', userData.id)
          .order('entry_date', { ascending: false })
          .limit(5);
          
        if (error) {
          console.error('Error fetching entries:', error);
          setIsLoading(false);
          return;
        }
        
        if (data && data.length > 0) {
          // Process the entries
          const processedEntries = data.map(entry => {
            let type: EntryType = 'text';
            let preview = '';
            
            if (entry.voice_transcript) {
              type = 'voice';
              preview = entry.voice_transcript;
            } else if (entry.photo_urls) {
              type = 'photo';
              preview = 'Photo journal entry';
            } else if (entry.text_content) {
              type = 'text';
              preview = entry.text_content;
            }
            
            return {
              id: entry.id,
              entry_date: entry.entry_date,
              text_content: entry.text_content,
              voice_transcript: entry.voice_transcript,
              photo_urls: entry.photo_urls,
              type,
              preview: preview || 'No content'
            };
          });
          
          setEntries(processedEntries);
        }
      } catch (error) {
        console.error('Error in fetchEntries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEntries();
  }, [user]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="reflect-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookIcon className="w-5 h-5 text-reflect-primary" />
          Recent Journal Entries
        </CardTitle>
        <CardDescription>
          Your latest reflections and thoughts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">Loading your entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">You don't have any journal entries yet.</p>
            <Link to="/new-entry" className="mt-4 inline-block">
              <Button className="reflect-button">Create Your First Entry</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map(entry => (
              <Link to={`/journal/${entry.id}`} key={entry.id}>
                <div className="flex items-start gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors">
                  <div className="mt-1">
                    {entry.type === 'text' && (
                      <FileTextIcon className="w-5 h-5 text-blue-500" />
                    )}
                    {entry.type === 'voice' && (
                      <MicIcon className="w-5 h-5 text-red-500" />
                    )}
                    {entry.type === 'photo' && (
                      <ImageIcon className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-reflect-muted">
                      {formatDate(entry.entry_date)}
                    </p>
                    <p className="line-clamp-2 text-reflect-text">{entry.preview}</p>
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-reflect-muted self-center" />
                </div>
              </Link>
            ))}
          </div>
        )}
        
        <Link to="/journal" className="mt-4 text-reflect-primary flex items-center gap-1 text-sm font-medium hover:underline w-fit">
          <span>View all entries</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
