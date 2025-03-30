import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightIcon, CalendarIcon, RefreshCwIcon } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { useCalendarEvents } from '@/hooks/use-database';
import { useGoogleCalendar } from '@/hooks/use-google-calendar';

const CalendarView = () => {
  console.log('Rendering CalendarView component');
  const { events, loading, error } = useCalendarEvents();
  const { syncCalendarEvents, isSyncing } = useGoogleCalendar();
  
  console.log('Calendar events:', { loading, error, eventsCount: events?.length });

  const handleSyncCalendar = async (e: React.MouseEvent) => {
    console.log('Sync Calendar button clicked');
    e.preventDefault();
    await syncCalendarEvents();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-heading text-lg font-bold">Upcoming Events</CardTitle>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-reflect-secondary"
              onClick={handleSyncCalendar}
              disabled={isSyncing}
            >
              <RefreshCwIcon className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Sync Calendar</span>
            </Button>
            <Link to="/calendar">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-reflect-primary"
                onClick={() => console.log('View Calendar button clicked')}
              >
                <span>View Calendar</span>
                <ArrowRightIcon className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        ) : error ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">Error loading calendar events.</p>
            <p className="text-xs text-reflect-muted mt-1">{error.message}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-8 text-center">
            <p className="text-reflect-muted">No calendar events found</p>
            <Link to="/profile">
              <Button 
                className="mt-4 reflect-button-outline"
                onClick={() => console.log('Connect Calendar link clicked from CalendarView')}
              >
                <CalendarIcon className="w-4 h-4 mr-2" />
                Connect Calendar
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-start p-3 rounded-md border border-border bg-blue-50/50">
                <div className="w-12 h-12 bg-blue-100 rounded-md flex flex-col items-center justify-center mr-3 shrink-0">
                  <span className="text-xs text-blue-600 font-medium">{format(parseISO(event.start_time), 'MMM')}</span>
                  <span className="text-xl font-bold leading-tight text-blue-700">{format(parseISO(event.start_time), 'd')}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1 line-clamp-1">
                    {isToday(parseISO(event.start_time)) && <span className="text-reflect-primary mr-1">Today:</span>} 
                    {event.event_title}
                  </h4>
                  <div className="flex items-center text-sm text-reflect-muted">
                    <span>{format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {events.length > 5 && (
              <div className="text-center mt-2">
                <Link to="/calendar">
                  <Button variant="ghost" size="sm" className="text-reflect-primary">
                    View all {events.length} events
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;