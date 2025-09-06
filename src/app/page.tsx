"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { DataUpload } from '@/components/finview/data-upload';
import { AnalysisDashboard } from '@/components/finview/analysis-dashboard';
import { Logo } from '@/components/finview/logo';
import { parseCSV } from '@/lib/csv-parser';
import { type Transaction } from '@/lib/types';
import { generateVisualizations, type GenerateVisualizationsOutput } from '@/ai/flows/generate-visualizations';
import { suggestDateRanges, type SuggestDateRangesOutput } from '@/ai/flows/suggest-date-ranges';
import { useToast } from "@/hooks/use-toast";

type AppState = 'initial' | 'loading' | 'dashboard' | 'error';

export default function Home() {
  const [appState, setAppState] = useState<AppState>('initial');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [csvString, setCsvString] = useState<string>('');
  const [aiInsights, setAiInsights] = useState<GenerateVisualizationsOutput | null>(null);
  const [suggestedRanges, setSuggestedRanges] = useState<SuggestDateRangesOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [printingChartId, setPrintingChartId] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    setAppState('loading');
    setError(null);
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target?.result as string;
      if (!text) {
        handleError('File is empty.');
        return;
      }

      try {
        const parsedData = parseCSV(text);
        if (parsedData.length === 0) {
          handleError('No valid transaction data found in the file.');
          return;
        }

        setTransactions(parsedData);
        setCsvString(text);

        // Don't await these, let them run in parallel
        generateAiInsights(text);

        setAppState('dashboard');

      } catch (err) {
        handleError(err instanceof Error ? err.message : 'An unknown error occurred during parsing.');
      }
    };

    reader.onerror = () => {
      handleError('Failed to read the file.');
    };

    reader.readAsText(file);
  };
  
  const generateAiInsights = async (csvData: string) => {
    try {
      const [insights, ranges] = await Promise.all([
        generateVisualizations({ csvData }),
        suggestDateRanges({ csvData }),
      ]);
      setAiInsights(insights);
      setSuggestedRanges(ranges);
    } catch (err) {
      console.error('AI generation failed:', err);
      toast({
        variant: "destructive",
        title: "AI Generation Failed",
        description: "Could not generate AI insights. You can still analyze the data manually.",
      });
    }
  }

  const handleError = (message: string) => {
    setError(message);
    setAppState('error');
    toast({
      variant: "destructive",
      title: "Oh no! Something went wrong.",
      description: message,
    });
  };
  
  const resetApp = () => {
    setAppState('initial');
    setTransactions([]);
    setCsvString('');
    setAiInsights(null);
    setSuggestedRanges(null);
    setError(null);
  };

  useEffect(() => {
    const handleAfterPrint = () => {
      document.body.classList.remove('is-printing');
      setPrintingChartId(null);
    };

    if (printingChartId) {
      document.body.classList.add('is-printing');
      // Delay print slightly to allow DOM updates
      setTimeout(() => window.print(), 100);
    }

    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
      document.body.classList.remove('is-printing');
    };
  }, [printingChartId]);

  const MainContent = useMemo(() => {
    switch (appState) {
      case 'dashboard':
        return (
          <AnalysisDashboard
            transactions={transactions}
            aiInsights={aiInsights}
            suggestedRanges={suggestedRanges}
            isLoadingAi={!aiInsights || !suggestedRanges}
            onNewUpload={resetApp}
            onPrintChart={setPrintingChartId}
            printingChartId={printingChartId}
          />
        );
      case 'loading':
      case 'initial':
      case 'error':
      default:
        return (
          <DataUpload 
            onFileUpload={handleFileUpload} 
            isLoading={appState === 'loading'}
          />
        );
    }
  }, [appState, transactions, aiInsights, suggestedRanges, printingChartId]);

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-12 bg-background transition-colors duration-300">
      <header className="flex items-center gap-4 mb-8">
        <Logo className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-headline font-bold text-foreground">FinView</h1>
      </header>
      <div className="w-full max-w-screen-2xl">
        {MainContent}
      </div>
    </main>
  );
}
