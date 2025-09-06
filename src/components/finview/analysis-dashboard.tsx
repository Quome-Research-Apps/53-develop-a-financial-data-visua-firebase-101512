"use client";

import { useState, useMemo } from 'react';
import type { DateRange } from 'react-day-picker';
import { type Transaction } from '@/lib/types';
import { FilterControls } from './filter-controls';
import { SummaryCards } from './summary-cards';
import { CategorySpendingChart } from './category-spending-chart';
import { SpendingPieChart } from './spending-pie-chart';
import { SpendingOverTimeChart } from './spending-over-time-chart';
import { AiInsights } from './ai-insights';
import { type GenerateVisualizationsOutput } from '@/ai/flows/generate-visualizations';
import { type SuggestDateRangesOutput } from '@/ai/flows/suggest-date-ranges';

type AnalysisDashboardProps = {
  transactions: Transaction[];
  aiInsights: GenerateVisualizationsOutput | null;
  suggestedRanges: SuggestDateRangesOutput | null;
  isLoadingAi: boolean;
  onNewUpload: () => void;
  onPrintChart: (chartId: string) => void;
  printingChartId: string | null;
};

export function AnalysisDashboard({
  transactions,
  aiInsights,
  suggestedRanges,
  isLoadingAi,
  onNewUpload,
  onPrintChart,
  printingChartId
}: AnalysisDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = useMemo(() => {
    const allCategories = transactions.map(t => t.category);
    return ['all', ...Array.from(new Set(allCategories))];
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const inDateRange = !dateRange?.from || !dateRange?.to || (t.date >= dateRange.from && t.date <= dateRange.to);
      const inCategory = selectedCategory === 'all' || t.category === selectedCategory;
      return inDateRange && inCategory;
    });
  }, [transactions, dateRange, selectedCategory]);

  return (
    <div className="flex flex-col gap-6">
      <FilterControls
        dateRange={dateRange}
        setDateRange={setDateRange}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        onNewUpload={onNewUpload}
      />
      
      <SummaryCards transactions={filteredTransactions} />

      <AiInsights insights={aiInsights} ranges={suggestedRanges} isLoading={isLoadingAi} onRangeSelect={setDateRange} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategorySpendingChart transactions={filteredTransactions} onPrint={() => onPrintChart('category-spending-chart')} id="category-spending-chart" className={`printable-content ${printingChartId === 'category-spending-chart' ? 'is-printing' : ''}`} />
        <SpendingPieChart transactions={filteredTransactions} onPrint={() => onPrintChart('spending-pie-chart')} id="spending-pie-chart" className={`printable-content ${printingChartId === 'spending-pie-chart' ? 'is-printing' : ''}`} />
      </div>
      
      <SpendingOverTimeChart transactions={filteredTransactions} onPrint={() => onPrintChart('spending-over-time-chart')} id="spending-over-time-chart" className={`printable-content ${printingChartId === 'spending-over-time-chart' ? 'is-printing' : ''}`}/>
    </div>
  );
}
