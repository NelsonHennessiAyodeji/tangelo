"use client";

import { useState, useEffect } from "react";
import PageHeader from "@/components/PageHeader";
import WeddingCountdown from "@/components/dashboard/WeddingCountdown";
import BudgetSummaryWidget from "@/components/dashboard/BudgetSummaryWidget";
import GuestCountWidget from "@/components/dashboard/GuestCountWidget";
import TaskProgressWidget from "@/components/dashboard/TaskProgressWidget";
import MyVendorsWidget from "@/components/dashboard/MyVendorsWidget";
import EventSummary from "@/components/dashboard/EventSummary";
import CalendarSection from "@/components/dashboard/CalendarSection";
import type { Wedding, Task, Guest, Expense, WeddingEvent } from "@/lib/types";
import { HomeIcon } from "lucide-react";
import {
  mockWeddingDetails,
  mockTasks,
  mockGuests,
  mockExpenses,
  mockBudget,
  mockEventDates,
} from "@/lib/mockData";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface EventDashboardData {
  totalGuests: number;
  acceptedGuests: number;
  totalSpent: number;
  completedTasks: number;
  totalTasks: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [wedding, setWedding] = useState<Wedding | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [eventData, setEventData] = useState<
    Record<string, EventDashboardData>
  >({});
  const [eventDates, setEventDates] = useState<WeddingEvent[]>([]);

  useEffect(() => {
    // Simulate fetching data
    const weddingDetails: Wedding = {
      ...mockWeddingDetails,
      id: "mock-wedding-id",
      events: mockWeddingDetails.events,
      location: mockWeddingDetails.location,
      wedding_date: mockEventDates[0].date.toISOString(), // Use first event as primary date
      budget: mockBudget.total,
      user: {
        first_name: mockWeddingDetails.couple.user.firstName,
      },
      partner: {
        first_name: mockWeddingDetails.couple.partner.firstName,
      },
    };
    setWedding(weddingDetails);
    setTasks(mockTasks);
    setEventDates(mockEventDates);

    const dataByEvent: Record<string, EventDashboardData> = {};
    for (const eventName of weddingDetails.events) {
      const eventTasks = mockTasks.filter((t) => t.event === eventName);
      const eventGuests = mockGuests.filter((g) => g.event === eventName);
      const eventExpenses = mockExpenses.filter((e) => e.event === eventName);

      dataByEvent[eventName] = {
        totalGuests: eventGuests.length,
        acceptedGuests: eventGuests.filter((g) => g.rsvp_status === "Accepted")
          .length,
        totalSpent: eventExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0
        ),
        completedTasks: eventTasks.filter((task) => task.completed).length,
        totalTasks: eventTasks.length,
      };
    }
    setEventData(dataByEvent);
    setLoading(false);
  }, []);

  if (loading || !wedding) {
    return (
      <div className="space-y-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-6 w-1/2 mt-2" />
        </div>
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-40 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const welcomeTitle = `Welcome, ${wedding.user?.first_name || "Planner"} & ${
    wedding.partner?.first_name || "Partner"
  }!`;
  const welcomeDescription = `Your personalized dashboard for your wedding celebrations.`;

  const outstandingTasks: Task[] = tasks
    .filter((task) => !task.completed && task.dueDate)
    .map((t) => ({ ...t, dueDate: new Date(t.dueDate!) }));

  return (
    <div className="space-y-8">
      <PageHeader
        title={welcomeTitle}
        description={welcomeDescription}
        icon={HomeIcon}
      />

      <EventSummary wedding={wedding} />

      <WeddingCountdown events={eventDates} />

      <Tabs defaultValue={wedding.events[0]} className="w-full">
        <TabsList className={`grid w-full grid-cols-${wedding.events.length}`}>
          {wedding.events.map((event) => (
            <TabsTrigger key={event} value={event}>
              {event}
            </TabsTrigger>
          ))}
        </TabsList>
        {wedding.events.map((event) => {
          const data = eventData[event];
          if (!data) return null;

          return (
            <TabsContent key={event} value={event}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                <BudgetSummaryWidget
                  totalSpent={data.totalSpent}
                  totalBudget={(wedding.budget || 0) / wedding.events.length}
                />
                <GuestCountWidget
                  totalGuests={data.totalGuests}
                  acceptedGuests={data.acceptedGuests}
                />
                <TaskProgressWidget
                  totalTasks={data.totalTasks}
                  completedTasks={data.completedTasks}
                />
                <MyVendorsWidget />
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3">
          <CalendarSection tasks={outstandingTasks} />
        </div>
      </div>
    </div>
  );
}
