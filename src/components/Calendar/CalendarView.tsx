
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CalendarIcon, CircleIcon } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface CalendarEvent {
  id: string;
  event_title: string;
  start_time: string;
  end_time: string;
}

interface JournalDate {
  date: string;
}

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [journalDates, setJournalDates] = useState<JournalDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    
    const fetchCalendarData = async () => {
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
        
        // Fetch calendar events
        const { data: eventData, error: eventError } = await supabase
          .from('calendar_events')
          .select('id, event_title, start_time, end_time')
          .eq('user_id', userData.id)
          .order('start_time', { ascending: true });
          
        if (eventError) {
          console.error('Error fetching events:', eventError);
        } else if (eventData) {
          setEvents(eventData);
        }
        
        // Fetch journal entry dates
        const { data: journalData, error: journalError } = await supabase
          .from('journal_entries')
          .select('entry_date')
          .eq('user_id', userData.id);
          
        if (journalError) {
          console.error('Error fetching journal dates:', journalError);
        } else if (journalData) {
          setJournalDates(journalData.map(item => ({ 
            date: new Date(item.entry_date).toISOString().split('T')[0]
          })));
        }
        
      } catch (error) {
        console.error('Error in fetchCalendarData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCalendarData();
  }, [user, currentMonth]);
  
  // Generate days for the current month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const daysArray = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      daysArray.push({ day: '', isCurrentMonth: false });
    }
    
    // Add all days of the current month
    for (let i = 1; i <= daysInMonth; i++) {
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      
      daysArray.push({
        day: i,
        dateString,
        hasEntry: journalDates.some(entry => entry.date === dateString),
        hasEvent: events.some(event => new Date(event.start_time).toISOString().split('T')[0] === dateString),
        isCurrentMonth: true
      });
    }
    
    return daysArray;
  };
  
  const days = getDaysInMonth(currentMonth);
  
  // Navigate to previous and next month
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Get month and year string
  const monthYearString = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  return (
    <Card className="reflect-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-reflect-primary" />
          Calendar
        </CardTitle>
        <CardDescription>
          View your entries and upcoming events
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="py-6 text-center">
            <p className="text-reflect-muted">Loading calendar...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <button 
                className="text-reflect-muted hover:text-reflect-primary"
                onClick={prevMonth}
              >
                &#8592; Prev
              </button>
              <h3 className="font-heading font-semibold">{monthYearString}</h3>
              <button 
                className="text-reflect-muted hover:text-reflect-primary"
                onClick={nextMonth}
              >
                Next &#8594;
              </button>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-medium text-reflect-muted py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div 
                  key={index}
                  className={`
                    aspect-square rounded-md flex flex-col items-center justify-center relative
                    ${day.isCurrentMonth ? 'hover:bg-gray-100' : 'opacity-30'} 
                    cursor-pointer transition-colors
                  `}
                >
                  {day.day && (
                    <>
                      <span className={`text-sm ${day.hasEntry || day.hasEvent ? 'font-medium' : ''}`}>
                        {day.day}
                      </span>
                      
                      <div className="flex gap-1 mt-1">
                        {day.hasEntry && (
                          <CircleIcon className="w-1.5 h-1.5 text-reflect-primary" />
                        )}
                        {day.hasEvent && (
                          <CircleIcon className="w-1.5 h-1.5 text-reflect-secondary" />
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            
            {events.length > 0 ? (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-medium mb-2">Upcoming Events</h4>
                <div className="space-y-2">
                  {events.slice(0, 3).map(event => (
                    <div key={event.id} className="flex gap-2 items-start">
                      <div className="w-2 h-2 rounded-full bg-reflect-secondary mt-1.5"></div>
                      <div>
                        <p className="font-medium">{event.event_title}</p>
                        <p className="text-sm text-reflect-muted">
                          {new Date(event.start_time).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric' 
                          })} at {new Date(event.start_time).toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-4 border-t text-center">
                <p className="text-reflect-muted">No upcoming events</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarView;
