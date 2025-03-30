
import React, { useState, useEffect } from 'react';
import { format, isToday, parseISO, isSameDay } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  FileTextIcon,
  MicIcon,
  ImageIcon,
  BookIcon,
  CalendarIcon,
  Loader2Icon,
  RefreshCwIcon
} from 'lucide-react';
import { useJournalEntries, useCalendarEvents } from '@/hooks/use-database';
import { JournalEntry, CalendarEvent } from '@/types/models';
import { DayContent } from 'react-day-picker';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';
import { useToast } from '@/hooks/use-toast';

const CalendarPage = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const { syncCalendarEvents, isSyncing } = useGoogleCalendar();
  const { toast } = useToast();
  
  // Fetch all journal entries
  const { entries: allEntries, loading: entriesLoading, error: entriesError } = useJournalEntries(100);
  
  // Fetch calendar events
  const { events: allEvents, loading: eventsLoading, error: eventsError } = useCalendarEvents();
  
  // Filter entries for selected date
  const selectedDateEntries = selectedDate 
    ? allEntries.filter(entry => {
        const entryDate = entry.entry_date ? parseISO(entry.entry_date) : parseISO(entry.created_at);
        return isSameDay(entryDate, selectedDate);
      })
    : [];

  // Filter events for selected date
  const selectedDateEvents = selectedDate
    ? allEvents.filter(event => {
        const eventStartDate = parseISO(event.start_time);
        return isSameDay(eventStartDate, selectedDate);
      })
    : [];

  // Generate dates that have entries
  const datesWithEntries = React.useMemo(() => {
    return allEntries.map(entry => {
      return entry.entry_date 
        ? parseISO(entry.entry_date) 
        : parseISO(entry.created_at);
    });
  }, [allEntries]);

  // Generate dates that have events
  const datesWithEvents = React.useMemo(() => {
    return allEvents.map(event => parseISO(event.start_time));
  }, [allEvents]);

  // Custom renderer for calendar day
  const renderDay = (day: React.ComponentProps<typeof DayContent>) => {
    const date = day.date;
    const hasEntry = datesWithEntries.some(entryDate => entryDate && date && isSameDay(entryDate, date));
    const hasEvent = datesWithEvents.some(eventDate => eventDate && date && isSameDay(eventDate, date));
    
    return (
      <div className="relative flex h-full w-full items-center justify-center p-0">
        <div className="absolute bottom-1 flex gap-0.5">
          {hasEntry && (
            <div className="h-1 w-1 rounded-full bg-reflect-primary" />
          )}
          {hasEvent && (
            <div className="h-1 w-1 rounded-full bg-reflect-secondary" />
          )}
        </div>
        <DayContent {...day} />
      </div>
    );
  };

  // Format entry types to display appropriate icons
  const getEntryTypeIcons = (entry: JournalEntry) => {
    return (
      <div className="flex gap-1 text-gray-500">
        {entry.text_content && <FileTextIcon className="w-4 h-4" />}
        {entry.voice_transcript && <MicIcon className="w-4 h-4" />}
        {entry.photo_urls && (entry.photo_urls as string[])?.length > 0 && <ImageIcon className="w-4 h-4" />}
      </div>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const handleMonthChange = (date: Date) => {
    setMonth(date);
  };

  const handleSyncCalendar = async () => {
    try {
      await syncCalendarEvents();
    } catch (error) {
      console.error('Error syncing calendar:', error);
      toast({
        title: 'Sync failed',
        description: 'Failed to sync calendar events. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const loading = entriesLoading || eventsLoading;

  return (
    <MainLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="font-heading text-3xl font-bold">Calendar</h1>
          <p className="text-reflect-muted">
            View your journal entries and upcoming events
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          className="text-reflect-secondary border-reflect-secondary/30 hover:bg-reflect-secondary/10"
          onClick={handleSyncCalendar}
          disabled={isSyncing}
        >
          <RefreshCwIcon className={`w-4 h-4 mr-1 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Calendar'}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={month}
              onMonthChange={handleMonthChange}
              className="rounded-md border"
              components={{
                Day: renderDay
              }}
            />
            
            <div className="flex items-center mt-4 pt-4 border-t gap-8">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-reflect-primary" />
                <span className="text-sm">Journal Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-reflect-secondary" />
                <span className="text-sm">Calendar Event</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-3 mt-6">
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-24 w-full" />
                </div>
              </div>
            ) : selectedDate ? (
              <div>
                <h3 className="text-lg font-medium mb-4">
                  {isToday(selectedDate) ? 'Today, ' : ''}
                  {format(selectedDate, 'MMMM d, yyyy')}
                </h3>
                
                {selectedDateEvents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-reflect-muted mb-2 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Events
                    </h4>
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                          <div className="flex justify-between">
                            <h5 className="font-medium">{event.event_title}</h5>
                            <span className="text-sm text-reflect-muted">
                              {format(parseISO(event.start_time), 'h:mm a')} - 
                              {format(parseISO(event.end_time), 'h:mm a')}
                            </span>
                          </div>
                          {event.event_description && (
                            <p className="text-sm text-reflect-muted mt-1">{event.event_description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDateEntries.length > 0 && (
                  <div>
                    <h4 className="font-medium text-reflect-muted mb-2 flex items-center gap-1">
                      <BookIcon className="w-4 h-4" />
                      Journal Entries
                    </h4>
                    <div className="space-y-3">
                      {selectedDateEntries.map(entry => (
                        <Link to={`/journal/${entry.id}`} key={entry.id}>
                          <div className="p-3 bg-purple-50 border border-purple-100 rounded-md hover:bg-purple-100 transition-colors">
                            <div className="flex justify-between items-start mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {format(parseISO(entry.entry_date || entry.created_at), 'h:mm a')}
                                </span>
                                {getEntryTypeIcons(entry)}
                              </div>
                            </div>
                            <p className="text-sm text-reflect-muted line-clamp-2">
                              {entry.text_content || entry.voice_transcript || 'No content available'}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDateEvents.length === 0 && selectedDateEntries.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-reflect-muted">No events or entries for this date.</p>
                    <Button 
                      className="reflect-button mt-4"
                      onClick={() => navigate('/new-entry')}
                    >
                      Create New Entry
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <CalendarIcon className="w-12 h-12 text-reflect-muted mx-auto mb-4" />
                <p className="text-reflect-muted">Select a date to view details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CalendarPage;
