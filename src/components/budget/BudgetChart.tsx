
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import type { Expense } from '@/lib/types';
import { TrendingUpIcon } from 'lucide-react';

interface BudgetChartProps {
  expenses: Expense[];
  totalBudget: number;
}

const chartConfig = {
  spent: {
    label: "Spent",
    color: "hsl(var(--primary))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--secondary))",
  },
  budget: {
    label: "Budget",
    color: "hsl(var(--accent))",
  }
} satisfies RechartsPrimitive.ChartConfig;


export default function BudgetChart({ expenses, totalBudget }: BudgetChartProps) {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = totalBudget - totalSpent;
  const budgetStatus = remainingBudget >= 0 ? 'On Track' : 'Over Budget';
  const overspentAmount = remainingBudget < 0 ? Math.abs(remainingBudget) : 0;

  const aggregatedExpenses = expenses.reduce<{[key: string]: number}>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  const chartData = Object.entries(aggregatedExpenses).map(([category, amount]) => ({
    category,
    spent: amount,
  }));

  const overallChartData = [
    { name: 'Event Budget', spent: totalSpent, budget: totalBudget, remaining: Math.max(0, remainingBudget) }
  ];


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <TrendingUpIcon className="mr-2 h-6 w-6 text-primary" />
          Budget Overview for this Event
        </CardTitle>
        <CardDescription>
          Total Spent: ₦{totalSpent.toLocaleString()} of ₦{totalBudget.toLocaleString()}
          <span className={`ml-2 font-semibold ${remainingBudget >= 0 ? 'text-green-600' : 'text-destructive'}`}>
            ({budgetStatus}{remainingBudget < 0 ? ` by ₦${overspentAmount.toLocaleString()}` : `, ₦${remainingBudget.toLocaleString()} remaining`})
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">Overall Spending</h3>
            <ChartContainer config={chartConfig} className="h-[150px] w-full">
              <BarChart accessibilityLayer data={overallChartData} layout="vertical" margin={{ left: 10, right: 30 }}>
                <CartesianGrid horizontal={false} />
                <XAxis type="number" dataKey="budget" hide />
                <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} hide/>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" hideLabel formatter={(value) => `₦${Number(value).toLocaleString()}`} />}
                />
                <Bar dataKey="spent" fill="var(--color-spent)" radius={5} stackId="a" barSize={30}>

                </Bar>
                <Bar dataKey="remaining" fill="var(--color-remaining)" radius={5} stackId="a" barSize={30} />
              </BarChart>
            </ChartContainer>
          </div>
          
          {chartData.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">Spending by Category</h3>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart accessibilityLayer data={chartData} layout="horizontal">
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    className="text-xs"
                  />
                  <YAxis tickFormatter={(value) => `₦${Number(value)/1000}k`} className="text-xs" />
                   <ChartTooltip content={<ChartTooltipContent indicator="dot" formatter={(value) => `₦${Number(value).toLocaleString()}`} />} />
                  <Bar dataKey="spent" fill="var(--color-spent)" radius={4} />
                </BarChart>
              </ChartContainer>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Ensure RechartsPrimitive is defined or imported if ChartConfig relies on it
// For Shadcn UI charts, this usually comes from 'recharts'
import * as RechartsPrimitive from 'recharts';
