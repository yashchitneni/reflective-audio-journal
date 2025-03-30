
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MicIcon, ImageIcon, FileTextIcon, ArrowRightIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useJournalEntries } from '@/hooks/use-database';

const RecentEntries = () => {
  const { entries, loading, error } = useJournalEntries(3);

  const getEntryPreview = (entry: any) => {
    if (entry.text_content) {
      return entry.text_content.slice(0, 120) + (entry.text_content.length > 120 ? '...' : '');
    } else if (entry.voice_transcript) {
      return entry.voice_transcript.slice(0, 120) + (entry.voice_transcript.length > 120 ? '...' : '');
    } else {
      return 'No content available';
    }
  };

  const getEntryTypeIcons = (entry: any) => {
    return (
      <div className="flex gap-1">
        {entry.text_content && <FileTextIcon className="w-3 h-3 text-gray-500" />}
        {entry.voice_transcript && <MicIcon className="w-3 h-3 text-gray-500" />}
        {entry.photo_urls && entry.photo_urls.length > 0 && <ImageIcon className="w-3 h-3 text-gray-500" />}
      </div>
    );
  };

  if (error) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="font-heading text-lg font-bold">Recent Entries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center">
            <p className="text-reflect-muted">There was an error loading your entries. Please try again later.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-heading text-lg font-bold">Recent Entries</CardTitle>
          <Link to="/journal">
            <Button variant="ghost" size="sm" className="text-reflect-primary">
              <span>View All</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">Loading your journal entries...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">No journal entries yet</p>
            <Link to="/new-entry">
              <Button className="mt-4 reflect-button">
                Create Your First Entry
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <Link to={`/journal/${entry.id}`} key={entry.id}>
                <div className="p-4 rounded-md border border-border hover:border-primary/20 hover:bg-muted/50 transition-all">
                  <div className="flex justify-between items-start mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {format(new Date(entry.entry_date), 'MMM d, yyyy')}
                      </span>
                      {getEntryTypeIcons(entry)}
                    </div>
                  </div>
                  <p className="text-sm text-reflect-muted line-clamp-2">
                    {getEntryPreview(entry)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
