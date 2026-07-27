
'use client';

import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ListChecksIcon, ArrowRightIcon } from 'lucide-react';

interface TaskProgressWidgetProps {
  completedTasks: number;
  totalTasks: number;
}

export default function TaskProgressWidget({ completedTasks, totalTasks }: TaskProgressWidgetProps) {
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center">
            <ListChecksIcon className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-lg font-headline">Task Progress</CardTitle>
        </div>
        <Link href="/checklist" passHref>
          <Button variant="ghost" size="sm">
            View All <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Progress value={progressPercentage} className="w-full h-3 mb-2" />
        <p className="text-sm text-muted-foreground">
          {completedTasks} of {totalTasks} tasks completed
        </p>
        <p className="text-2xl font-bold text-primary mt-1">{Math.round(progressPercentage)}%</p>
      </CardContent>
    </Card>
  );
}
