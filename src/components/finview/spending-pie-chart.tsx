"use client";

import * as React from 'react';
import { Pie, PieChart, ResponsiveContainer, Cell } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type Transaction } from '@/lib/types';
import { Button } from '../ui/button';
import { Printer } from 'lucide-react';
import { cn } from '@/lib/utils';


const SpendingPieChartComponent = ({ transactions, onPrint, id, className }: { transactions: Transaction[], onPrint: () => void, id: string, className?: string }) => {
  const { chartData, chartConfig } = React.useMemo(() => {
    if (!transactions) return { chartData: [], chartConfig: {} };

    const categoryTotals = transactions.reduce((acc, { category, amount }) => {
      if (amount < 0) { // Assuming spending is represented by negative amounts
        const currentTotal = acc.get(category) || 0;
        acc.set(category, currentTotal + Math.abs(amount));
      }
      return acc;
    }, new Map<string, number>());
    
    const sortedData = Array.from(categoryTotals.entries())
      .map(([category, amount]) => ({ name: category, value: amount, fill: '' }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Take top 5

    const config: ChartConfig = {};
    const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

    sortedData.forEach((item, index) => {
      config[item.name] = {
        label: item.name,
        color: colors[index % colors.length],
      };
      item.fill = colors[index % colors.length];
    });

    return { chartData: sortedData, chartConfig: config };
  }, [transactions]);
  
  if (chartData.length === 0) {
    return (
      <Card id={id} className={cn(className)}>
        <CardHeader>
          <CardTitle>Spending Distribution</CardTitle>
          <CardDescription>No spending data available for the selected period.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-80">
          <p className="text-muted-foreground">No data to display</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id={id} className={cn(className)}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="font-headline">Spending Distribution</CardTitle>
            <CardDescription>Top 5 categories by spending</CardDescription>
          </div>
          <Button variant="ghost" size="icon" onClick={onPrint} className="no-print">
            <Printer className="w-4 h-4" />
            <span className="sr-only">Print chart</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent
                  formatter={(value) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value as number)}
                  nameKey="name"
                />}
              />
              <Pie data={chartData} dataKey="value" nameKey="name" innerRadius="50%" outerRadius="80%">
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export const SpendingPieChart = React.memo(SpendingPieChartComponent);
