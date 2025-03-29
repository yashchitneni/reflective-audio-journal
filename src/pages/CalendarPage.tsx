
import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronsLeftIcon, 
  ChevronsRightIcon,
  CircleIcon,
  CalendarIcon,
  FileTextIcon,
  MicIcon,
  ImageIcon,
  BookIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for calendar events and entries
const mockData = {
  events: [
    { id: 1, date: '2023-10-24', title: 'Team Meeting', time: '10:00 AM', description: 'Weekly team sync-up' },
    { id: 2, date: '2023-10-26', title: 'Doctor Appointment', time: '3:30 PM', description: 'Annual check-up' },
    { id: 3, date: '2023-10-30', title: 'Birthday Party', time: '7:00 PM', description: 'Alex\'s birthday celebration' }
  ],
  entries: [
    { id: '1', date: '2023-10-20', type: 'text', title: 'Productive Day' },
    { id: '2', date: '2023-10-19', type: 'voice', title: 'Feeling Overwhelmed' },
    { id: '3', date: '2023-10-18', type: 'photo', title: 'Mountain Hike' },
    { id: '4', date: '2023-10-15', type: 'text', title: 'Weekend Reflection' },
    { id: '5', date: '2023-10-10', type: 'voice', title: 'Morning Thoughts' }
  ]
};

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
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
        hasEntry: mockData.entries.some(entry => entry.date === dateString),
        hasEvent: mockData.events.some(event => event.date === dateString),
        isCurrentMonth: true
      });
    }
    
    return daysArray;
  };
  
  const days = getDaysInMonth(currentDate);
  
  // Navigate through months
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };
  
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };
  
  const prevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1));
  };
  
  const nextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1));
  };
  
  // Get month and year string
  const monthYearString = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  });
  
  // Get events and entries for selected date
  const getEventsForDate = (dateString: string) => {
    return mockData.events.filter(event => event.date === dateString);
  };
  
  const getEntriesForDate = (dateString: string) => {
    return mockData.entries.filter(entry => entry.date === dateString);
  };
  
  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const selectedDateEntries = selectedDate ? getEntriesForDate(selectedDate) : [];
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">Calendar</h1>
        <p className="text-reflect-muted">
          View your journal entries and upcoming events
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={prevYear}>
                  <ChevronsLeftIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={prevMonth}>
                  <ChevronLeftIcon className="h-4 w-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-semibold">{monthYearString}</h2>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRightIcon className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextYear}>
                  <ChevronsRightIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-reflect-muted py-2">
                  {day}
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-1">
              {days.map((day, index) => (
                <div 
                  key={index}
                  className={`
                    aspect-square rounded-md flex flex-col items-center justify-start p-2
                    ${day.isCurrentMonth ? 'hover:bg-gray-100' : 'opacity-30'} 
                    ${selectedDate === day.dateString ? 'bg-reflect-primary/10 border border-reflect-primary' : ''}
                    cursor-pointer transition-colors
                  `}
                  onClick={() => day.dateString && setSelectedDate(day.dateString)}
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
            
            <div className="flex items-center mt-4 pt-4 border-t gap-8">
              <div className="flex items-center gap-2">
                <CircleIcon className="w-3 h-3 text-reflect-primary" />
                <span className="text-sm">Journal Entry</span>
              </div>
              <div className="flex items-center gap-2">
                <CircleIcon className="w-3 h-3 text-reflect-secondary" />
                <span className="text-sm">Calendar Event</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            {selectedDate ? (
              <div>
                <h3 className="text-lg font-medium mb-4">{formatDate(selectedDate)}</h3>
                
                {selectedDateEvents.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium text-reflect-muted mb-2 flex items-center gap-1">
                      <CalendarIcon className="w-4 h-4" />
                      Events
                    </h4>
                    <div className="space-y-3">
                      {selectedDateEvents.map(event => (
                        <div key={event.id} className="p-3 bg-gray-50 rounded-md">
                          <div className="flex justify-between">
                            <h5 className="font-medium">{event.title}</h5>
                            <span className="text-sm text-reflect-muted">{event.time}</span>
                          </div>
                          <p className="text-sm text-reflect-muted mt-1">{event.description}</p>
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
                          <div className="p-3 bg-gray-50 rounded-md flex items-center gap-2 hover:bg-gray-100 transition-colors">
                            {entry.type === 'text' && (
                              <FileTextIcon className="w-5 h-5 text-blue-500" />
                            )}
                            {entry.type === 'voice' && (
                              <MicIcon className="w-5 h-5 text-red-500" />
                            )}
                            {entry.type === 'photo' && (
                              <ImageIcon className="w-5 h-5 text-green-500" />
                            )}
                            <span className="font-medium">{entry.title}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedDateEvents.length === 0 && selectedDateEntries.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-reflect-muted">No events or entries for this date.</p>
                    <Link to="/new-entry">
                      <Button className="reflect-button mt-4">
                        Create New Entry
                      </Button>
                    </Link>
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
