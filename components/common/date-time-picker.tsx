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
              'border-border bg-surface hover:bg-surface-tertiary h-11 flex-1 justify-start text-left font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, 'PPP') : <span>{label} (Date)</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="border-border bg-surface text-foreground w-auto p-0"
          align="start"
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            autoFocus
            className="text-muted-foreground"
            styles={{
              weekday: { color: 'gray' },
              day_button: { color: 'white' },
            }}
            modifiersStyles={{
              selected: { backgroundColor: 'white', color: 'black' },
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="relative flex items-center">
        <Clock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          type="time"
          value={time}
          onChange={handleTimeChange}
          className="h-11 pl-10 scheme-dark"
        />
      </div>
    </div>
  );
};
