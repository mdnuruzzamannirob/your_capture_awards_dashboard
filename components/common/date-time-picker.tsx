'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface DateTimePickerProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  label: string;
}

export const DateTimePicker = ({ date, setDate, label }: DateTimePickerProps) => {
  const time = date ? format(date, 'HH:mm') : '';

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.target.value.split(':').map(Number);
    if (date) {
      // Update only the time part
      const newDate = new Date(date);
      newDate.setHours(hours, minutes);
      setDate(newDate);
    } else {
      // If no date, set today's date with the selected time
      const newDate = new Date();
      newDate.setHours(hours, minutes, 0, 0);
      setDate(newDate);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'flex-1 justify-start border-gray-800 bg-gray-900 text-left font-normal hover:bg-gray-800',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>{label} (Date)</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-auto border-gray-700 bg-gray-900 p-0 text-gray-200"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
            className="text-gray-200"
            styles={{
              head_cell: { color: 'gray' },
              day: { color: 'white' },
              day_selected: { backgroundColor: 'white', color: 'black' },
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Clock className="absolute top-2.5 left-3 h-4 w-4 text-gray-500" />
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="border-gray-800 bg-gray-900 pl-10 text-white scheme-dark"
        />
      </div>
    </div>
  );
};
