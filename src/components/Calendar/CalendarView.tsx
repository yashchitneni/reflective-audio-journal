
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRightIcon, CalendarIcon } from 'lucide-react';
import { format, isToday, parseISO } from 'date-fns';
import { useCalendarEvents } from '@/hooks/use-database';

const CalendarView = () => {
  const { events, loading, error } = useCalendarEvents();

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="font-heading text-lg font-bold">Upcoming Events</CardTitle>
          <Link to="/calendar">
            <Button variant="ghost" size="sm" className="text-reflect-primary">
              <span>View Calendar</span>
              <ArrowRightIcon className="w-4 h-4 ml-1" />
            </Button>
          </Link>
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
              <Button className="mt-4 reflect-button-outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                Connect Calendar
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div key={event.id} className="flex items-start p-3 rounded-md border border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-md flex flex-col items-center justify-center mr-3 shrink-0">
                  <span className="text-xs text-primary font-medium">{format(parseISO(event.start_time), 'MMM')}</span>
                  <span className="text-xl font-bold leading-tight">{format(parseISO(event.start_time), 'd')}</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1 line-clamp-1">
                    {isToday(parseISO(event.start_time)) && <span className="text-primary mr-1">Today:</span>} 
                    {event.event_title}
                  </h4>
                  <div className="flex items-center text-sm text-reflect-muted">
                    <span>{format(parseISO(event.start_time), 'h:mm a')} - {format(parseISO(event.end_time), 'h:mm a')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
