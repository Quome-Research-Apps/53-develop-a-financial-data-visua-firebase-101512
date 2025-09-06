"use client";

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Transaction } from '@/lib/types';
import { ArrowDown, Hash, Sigma } from 'lucide-react';

type SummaryCardsProps = {
  transactions: Transaction[];
};

export function SummaryCards({ transactions }: SummaryCardsProps) {
  const { totalSpending, transactionCount, averageTransaction } = useMemo(() => {
    const spendingTransactions = transactions.filter(t => t.amount < 0);
    const total = spendingTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const count = spendingTransactions.length;
    return {
      totalSpending: total,
      transactionCount: count,
      averageTransaction: count > 0 ? total / count : 0,
    };
  }, [transactions]);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
          <ArrowDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalSpending)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <Hash className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionCount}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
          <Sigma className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(averageTransaction)}</div>
        </CardContent>
      </Card>
    </div>
  );
}
