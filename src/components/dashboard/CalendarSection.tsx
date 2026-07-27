
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import type { Task } from '@/lib/types';
import { CalendarDaysIcon, CircleIcon } from 'lucide-react';
import { format, isSameDay } from 'date-fns';

interface CalendarSectionProps {
  tasks: Task[]; // Expecting outstanding tasks with due dates
}

export default function CalendarSection({ tasks }: CalendarSectionProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  const tasksOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return tasks.filter(task => task.dueDate && isSameDay(task.dueDate, selectedDate));
  }, [selectedDate, tasks]);

  const taskDateModifiers = useMemo(() => {
    const taskDates = tasks.map(task => task.dueDate).filter(Boolean) as Date[];
    return {
      hasTask: taskDates,
    };
  }, [tasks]);

  return (
    <Card className="h-full flex flex-col shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="font-headline flex items-center">
            <CalendarDaysIcon className="h-6 w-6 mr-2 text-primary" />
            Upcoming Deadlines
        </CardTitle>
        <CardDescription>
          Your task calendar. Dates with a dot have deadlines. Click a date to view tasks.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col md:flex-row gap-6 items-start pt-2">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          className="rounded-md border self-center"
          modifiers={taskDateModifiers}
          components={{
            DayContent: (props) => {
              const isTaskDay = props.activeModifiers.hasTask;
              return (
                <div className="relative h-full w-full flex items-center justify-center">
                  {props.date.getDate()}
                  {isTaskDay && (
                     <span className="absolute bottom-1">
                       <CircleIcon className="h-1.5 w-1.5 fill-primary text-primary" />
                     </span>
                  )}
                </div>
              );
            },
          }}
        />
        <div className="flex-grow w-full">
            {selectedDate ? (
              <div className="space-y-2">
                <h4 className="font-semibold leading-none text-foreground border-b pb-2">Tasks for {format(selectedDate, "PPP")}</h4>
                <div className="grid gap-2 max-h-48 overflow-y-auto pr-2 mt-2">
                  {tasksOnSelectedDate.length > 0 ? (
                    tasksOnSelectedDate.map(task => (
                      <div key={task.id} className="grid grid-cols-[25px_1fr] items-start pb-2 last:mb-0 last:pb-0">
                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-primary mt-1" />
                        <div className="grid gap-1">
                          <p className="text-sm font-medium leading-none">
                            {task.name}
                          </p>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">{task.description}</p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground pt-2">No tasks scheduled for this day.</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground pt-2">Select a date to see tasks.</p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
