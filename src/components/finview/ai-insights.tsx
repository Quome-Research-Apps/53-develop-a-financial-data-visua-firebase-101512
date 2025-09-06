"use client";

import { type GenerateVisualizationsOutput } from '@/ai/flows/generate-visualizations';
import { type SuggestDateRangesOutput } from '@/ai/flows/suggest-date-ranges';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Lightbulb, CalendarClock } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

type AiInsightsProps = {
  insights: GenerateVisualizationsOutput | null;
  ranges: SuggestDateRangesOutput | null;
  isLoading: boolean;
  onRangeSelect: (range: DateRange) => void;
};

export function AiInsights({ insights, ranges, isLoading, onRangeSelect }: AiInsightsProps) {
  if (isLoading) {
    return <AiInsightsSkeleton />;
  }

  if (!insights && !ranges) {
    return null;
  }

  const handleRangeClick = (startDate: string, endDate: string) => {
    const from = new Date(startDate);
    const to = new Date(endDate);
    if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
      onRangeSelect({ from, to });
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="text-accent" />
          AI-Powered Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights && <p className="text-card-foreground/90">{insights.visualizationDescriptions}</p>}
        {ranges && ranges.dateRanges.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 mb-2 font-semibold text-card-foreground">
              <CalendarClock className="h-4 w-4 text-accent" />
              Suggested Date Ranges
            </h4>
            <div className="flex flex-wrap gap-2">
              {ranges.dateRanges.map((range, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleRangeClick(range.startDate, range.endDate)}
                  className="bg-transparent hover:bg-accent/20 border-primary/50"
                >
                  {range.reason}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function AiInsightsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <Lightbulb className="text-accent" />
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div>
            <h4 className="flex items-center gap-2 mb-2 font-semibold">
                <CalendarClock className="h-4 w-4 text-accent" />
                <Skeleton className="h-5 w-40" />
            </h4>
            <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-32 rounded-md" />
                <Skeleton className="h-8 w-40 rounded-md" />
                <Skeleton className="h-8 w-36 rounded-md" />
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
