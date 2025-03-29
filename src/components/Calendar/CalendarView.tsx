
import React, { useState } from 'react';
import { 
  Card, 
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { CalendarIcon, CircleIcon } from 'lucide-react';

// Mock data for calendar events and entries
const mockData = {
  events: [
    { id: 1, date: '2023-10-24', title: 'Team Meeting', time: '10:00 AM' },
    { id: 2, date: '2023-10-26', title: 'Doctor Appointment', time: '3:30 PM' },
    { id: 3, date: '2023-10-30', title: 'Birthday Party', time: '7:00 PM' }
  ],
  entries: ['2023-10-20', '2023-10-19', '2023-10-18', '2023-10-15', '2023-10-10']
};

const CalendarView = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
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
        hasEntry: mockData.entries.includes(dateString),
        hasEvent: mockData.events.some(event => event.date === dateString),
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
        
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">Upcoming Events</h4>
          <div className="space-y-2">
            {mockData.events.map(event => (
              <div key={event.id} className="flex gap-2 items-start">
                <div className="w-2 h-2 rounded-full bg-reflect-secondary mt-1.5"></div>
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-reflect-muted">
                    {new Date(event.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })} at {event.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;
