"use client";

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Upload, ChevronsUpDown } from 'lucide-react';
import { type DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type FilterControlsProps = {
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  onNewUpload: () => void;
};

export function FilterControls({
  dateRange,
  setDateRange,
  selectedCategory,
  setSelectedCategory,
  categories,
  onNewUpload,
}: FilterControlsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-lg bg-card/80 backdrop-blur-sm border">
      <div className="flex flex-wrap items-center gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant="outline"
              className={cn('w-[300px] justify-start text-left font-normal bg-transparent', !dateRange && 'text-muted-foreground')}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange?.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(dateRange.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[200px] bg-transparent">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category} value={category} className="capitalize">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
       <Button onClick={onNewUpload} variant="outline" className="bg-transparent">
        <Upload className="mr-2 h-4 w-4" />
        Upload New File
      </Button>
    </div>
  );
}
