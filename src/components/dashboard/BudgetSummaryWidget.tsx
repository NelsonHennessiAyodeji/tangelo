
'use client';

import Link from 'next/link';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { TrendingUp, ArrowRightIcon } from 'lucide-react';

interface BudgetSummaryWidgetProps {
  totalSpent: number;
  totalBudget: number;
}

const chartConfig = {
  spent: { label: "Spent", color: "hsl(var(--primary))" },
  remaining: { label: "Remaining", color: "hsl(var(--secondary))" },
} as const;

export default function BudgetSummaryWidget({ totalSpent, totalBudget }: BudgetSummaryWidgetProps) {
  const remainingBudget = Math.max(0, totalBudget - totalSpent);

  const chartData = [
    { name: 'Budget Status', spent: totalSpent, remaining: remainingBudget, budget: totalBudget },
  ];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow col-span-1 md:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-lg font-headline">Budget Snapshot</CardTitle>
        </div>
        <Link href="/budget" passHref>
          <Button variant="ghost" size="sm">
            Details <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
            <p className="text-2xl font-bold text-primary">₦{totalSpent.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Spent of ₦{totalBudget.toLocaleString()}</p>
        </div>
        <ChartContainer config={chartConfig} className="h-[60px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0, right: 0, top: 5, bottom: 5 }}
          >
            <XAxis type="number" dataKey="budget" hide />
            <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} hide/>
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" hideLabel formatter={(value, name) => `${chartConfig[name as keyof typeof chartConfig]?.label}: ₦${Number(value).toLocaleString()}`} />}
            />
            <Bar dataKey="spent" fill="var(--color-spent)" radius={[5, 0, 0, 5]} stackId="a" barSize={20} />
            <Bar dataKey="remaining" fill="var(--color-remaining)" radius={[0, 5, 5, 0]} stackId="a" barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
