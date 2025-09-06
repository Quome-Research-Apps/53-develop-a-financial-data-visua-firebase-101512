"use client";

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Transaction } from '@/lib/types';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';


const chartConfig = {
  amount: {
    label: 'Amount',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type CategorySpendingChartProps = {
  transactions: Transaction[];
  onPrint: () => void;
  id: string;
  className?: string;
};

export function CategorySpendingChart({ transactions, onPrint, id, className }: CategorySpendingChartProps) {
  const data = useMemo(() => {
    const categoryTotals = transactions.reduce((acc, { category, amount }) => {
      if (amount < 0) { // Assuming spending is represented by negative amounts
        const currentTotal = acc.get(category) || 0;
        acc.set(category, currentTotal + Math.abs(amount));
      }
      return acc;
    }, new Map<string, number>());
    
    return Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Show top 10 categories
  }, [transactions]);
  
  if (data.length === 0) {
    return (
       <Card id={id} className={cn(className)}>
        <CardHeader>
          <CardTitle>Spending by Category</CardTitle>
          <CardDescription>No spending data available for the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card id={id} className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Spending by Category</CardTitle>
            <CardDescription>Top 10 spending categories</CardDescription>
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
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                dataKey="category"
                type="category"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: 'hsl(var(--foreground))' }}
                width={100}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  labelFormatter={(value) => chartConfig[value as keyof typeof chartConfig]?.label}
                  formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                  />}
              />
              <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
