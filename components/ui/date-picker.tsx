'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface DatePickerProps<T> {
    id: string;
    field: keyof T;
    message: string;
    setter: (id: string, field: keyof T, value: string | boolean | string[] | Date | null) => void;
    providedDate: Date | null;
}

export function DatePicker<T>({ id, field, message, setter, providedDate }: DatePickerProps<T>) {
    const [date, setDate] = useState<Date | undefined>(undefined);

    useEffect(() => {
        if (providedDate) {
            handleDateChange(providedDate);
        }
    }, []);

    const handleDateChange = (selectedDate: Date | undefined) => {
        setDate(selectedDate);
        setter(id, field, selectedDate || null);
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn('w-[280px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>{message}</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                <Calendar mode="single" selected={date} onSelect={handleDateChange} initialFocus />
            </PopoverContent>
        </Popover>
    );
}
