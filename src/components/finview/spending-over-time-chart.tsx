"use client";

import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Transaction } from '@/lib/types';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

const chartConfig = {
  amount: {
    label: 'Spending',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type SpendingOverTimeChartProps = {
  transactions: Transaction[];
  onPrint: () => void;
  id: string;
  className?: string;
};

export function SpendingOverTimeChart({ transactions, onPrint, id, className }: SpendingOverTimeChartProps) {
  const data = useMemo(() => {
    const dailyTotals = transactions.reduce((acc, { date, amount }) => {
      if (amount < 0) { // Assuming spending is negative
        const day = format(date, 'yyyy-MM-dd');
        const currentTotal = acc.get(day) || 0;
        acc.set(day, currentTotal + Math.abs(amount));
      }
      return acc;
    }, new Map<string, number>());

    return Array.from(dailyTotals.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [transactions]);
  
  if (data.length < 2) {
    return (
      <Card id={id} className={cn(className)}>
        <CardHeader>
          <CardTitle>Spending Over Time</CardTitle>
          <CardDescription>Not enough data to display a trend.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">At least two data points required</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id={id} className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Spending Over Time</CardTitle>
            <CardDescription>Daily spending trend for the selected period</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onPrint} className="no-print">
            <Printer className="w-4 h-4" />
            <span className="sr-only">Print chart</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer>
            <AreaChart data={data} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-amount)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--color-amount)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => format(new Date(value), 'MMM d')}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => `$${(value as number / 1000).toFixed(0)}k`}
                tick={{ fill: 'hsl(var(--foreground))' }}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent 
                    formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                    labelFormatter={(label) => format(new Date(label), 'MMM dd, yyyy')}
                />}
              />
              <Area type="monotone" dataKey="amount" stroke="var(--color-amount)" fill="url(#colorAmount)" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
