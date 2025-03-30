
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useJournalEntry } from '@/hooks/use-database';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  FileText, 
  Mic, 
  Image, 
  Trash2, 
  Edit,
  Loader2 
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const JournalEntryPage = () => {
  const { entryId } = useParams<{ entryId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entry, loading, error } = useJournalEntry(entryId);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleBack = () => {
    navigate('/journal');
  };

  const handleDelete = async () => {
    if (!user?.id || !entryId) return;
    
    try {
      setIsDeleting(true);
      
      // First get the user's profile to get their internal ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (userError) throw userError;
      
      // Delete the entry
      const { error: deleteError } = await supabase
        .from('journal_entries')
        .delete()
        .eq('user_id', userData.id)
        .eq('id', entryId);

      if (deleteError) throw deleteError;

      toast({
        title: "Success",
        description: "Journal entry deleted successfully",
      });
      
      navigate('/journal');
    } catch (e) {
      console.error('Error deleting journal entry:', e);
      toast({
        title: "Error",
        description: "Could not delete the journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Rendering loading skeletons
  if (loading) {
    return (
      <MainLayout>
        <div className="mb-6 flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        
        <div className="space-y-6">
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <Skeleton className="h-6 w-48 mb-3" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </MainLayout>
    );
  }

  // Rendering error state
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

  // Entry type badges
  const EntryTypeBadges = () => (
    <div className="flex gap-2 mb-4">
      {entry.text_content && (
        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
          <FileText className="w-3 h-3" /> Text
        </div>
      )}
      {entry.voice_transcript && (
        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
          <Mic className="w-3 h-3" /> Voice
        </div>
      )}
      {entry.photo_urls && (entry.photo_urls as string[]).length > 0 && (
        <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
          <Image className="w-3 h-3" /> Photos ({(entry.photo_urls as string[]).length})
        </div>
      )}
    </div>
  );

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="font-heading text-2xl font-bold">
            {format(new Date(entry.entry_date || entry.created_at), 'EEEE, MMMM d, yyyy')}
          </h1>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/edit-entry/${entry.id}`)}
            className="flex items-center gap-1"
          >
            <Edit className="w-4 h-4" />
            <span className="hidden sm:inline">Edit</span>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-1 text-destructive border-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Journal Entry</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this journal entry? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-between sm:justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete} 
                  disabled={isDeleting}
                >
                  {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <EntryTypeBadges />

      <div className="space-y-6">
        {entry.text_content && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-blue-500" />
              Written Entry
            </h2>
            <div className="whitespace-pre-wrap prose prose-sm max-w-none">
              {entry.text_content}
            </div>
          </div>
        )}
        
        {entry.voice_transcript && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-3 flex items-center">
              <Mic className="w-5 h-5 mr-2 text-red-500" />
              Voice Entry
            </h2>
            <div className="whitespace-pre-wrap prose prose-sm max-w-none">
              {entry.voice_transcript}
            </div>
            {entry.voice_audio_url && (
              <div className="mt-4 bg-muted p-4 rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center">
                  <Mic className="w-4 h-4 mr-1 text-red-500" />
                  Audio Recording
                </h3>
                <audio controls className="w-full">
                  <source src={entry.voice_audio_url} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        )}
        
        {entry.photo_urls && (entry.photo_urls as string[]).length > 0 && (
          <div className="bg-card rounded-lg p-6 border shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              <Image className="w-5 h-5 mr-2 text-green-500" />
              Photos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(entry.photo_urls as string[]).map((url, index) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden group relative">
                  <img 
                    src={url} 
                    alt={`Journal photo ${index + 1}`} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
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
