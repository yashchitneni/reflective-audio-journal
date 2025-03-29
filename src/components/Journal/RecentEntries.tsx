
import React from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { BookIcon, FileTextIcon, MicIcon, ImageIcon, ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for recent entries
const mockEntries = [
  {
    id: '1',
    date: new Date(2023, 9, 20), // October 20, 2023
    type: 'text',
    preview: 'Today was a productive day. I finished the project ahead of schedule and had time to...'
  },
  {
    id: '2',
    date: new Date(2023, 9, 19), // October 19, 2023
    type: 'voice',
    preview: 'I\'m feeling a bit overwhelmed with the upcoming deadline, but I\'m confident that...'
  },
  {
    id: '3',
    date: new Date(2023, 9, 18), // October 18, 2023
    type: 'photo',
    preview: 'Went for a hike in the mountains. The view was breathtaking and really helped clear my mind.'
  }
];

const RecentEntries = () => {
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
        <div className="space-y-4">
          {mockEntries.map(entry => (
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
                    {entry.date.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="line-clamp-2 text-reflect-text">{entry.preview}</p>
                </div>
                <ArrowRightIcon className="w-5 h-5 text-reflect-muted self-center" />
              </div>
            </Link>
          ))}
        </div>
        
        <Link to="/journal" className="mt-4 text-reflect-primary flex items-center gap-1 text-sm font-medium hover:underline w-fit">
          <span>View all entries</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
};

export default RecentEntries;
