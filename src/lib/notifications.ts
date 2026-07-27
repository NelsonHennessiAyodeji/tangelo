
import { differenceInDays, isPast, isWithinInterval, addDays, startOfToday } from 'date-fns';
import type { Notification, Task, WeddingEvent } from './types';
import { mockEventDates } from './mockData';

function getFirstDate(events: WeddingEvent[]): Date | null {
  if (events.length === 0) return null;

  const futureDates = events.map(e => e.date).filter(d => !isPast(d));
  if (futureDates.length > 0) {
    return futureDates.sort((a, b) => a.getTime() - b.getTime())[0];
  }
  // If all dates are in the past, maybe return the most recent one
  return events.map(e => e.date).sort((a, b) => b.getTime() - a.getTime())[0];
}

export function generateNotifications(tasks: Task[]): Notification[] {
  const notifications: Notification[] = [];
  const today = startOfToday();
  const targetDate = getFirstDate(mockEventDates);

  // Welcome notification
  notifications.push({
    id: 'welcome-1',
    message: "Welcome to Tangelo! Start by exploring your dashboard.",
    date: addDays(today, -7), // Simulating it happened a week ago
    read: true,
    type: 'success',
  });

  // Wedding countdown
  if (targetDate && !isPast(targetDate)) {
    const daysUntilWedding = differenceInDays(targetDate, today);
    if (daysUntilWedding >= 0 && daysUntilWedding <= 30) {
       const message = daysUntilWedding === 0 ? "Your wedding is today! Congratulations!" : `Your first event is in ${daysUntilWedding} day${daysUntilWedding !== 1 ? 's' : ''}!`;
      notifications.push({
        id: `countdown-${daysUntilWedding}`,
        message: message,
        date: today,
        read: false,
        type: 'info',
      });
    }
  }

  // Overdue tasks
  tasks.forEach(task => {
    if (!task.completed && task.dueDate && isPast(task.dueDate)) {
      notifications.push({
        id: `overdue-${task.id}`,
        message: `Task "${task.name}" is overdue.`,
        date: task.dueDate,
        read: false,
        type: 'alert',
      });
    }
  });

  // Tasks due this week
  const nextWeek = addDays(today, 7);
  const tasksDueThisWeek = tasks.filter(task => 
    !task.completed && 
    task.dueDate && 
    isWithinInterval(task.dueDate, { start: today, end: nextWeek })
  );

  if (tasksDueThisWeek.length > 0) {
     notifications.push({
      id: 'due-this-week',
      message: `You have ${tasksDueThisWeek.length} task${tasksDueThisWeek.length > 1 ? 's' : ''} due this week.`,
      date: today,
      read: false,
      type: 'info',
    });
  }

  return notifications.sort((a, b) => b.date.getTime() - a.date.getTime());
}
