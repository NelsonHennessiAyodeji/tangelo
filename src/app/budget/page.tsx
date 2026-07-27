// src/app/budget/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import type { Expense } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import BudgetChart from "@/components/budget/BudgetChart";
import ExpenseTracker from "@/components/budget/ExpenseTracker";
import {
  Banknote,
  Edit3Icon,
  Save,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Download,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { mockExpenses, mockBudget, mockWeddingDetails } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface EventBudgetEditorProps {
  event: string;
  budget: number;
  spent: number;
  onUpdate: (event: string, newBudget: number) => void;
}

function EventBudgetEditor({
  event,
  budget,
  spent,
  onUpdate,
}: EventBudgetEditorProps) {
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(budget.toString());
  const { toast } = useToast();

  const spendingPercentage = budget > 0 ? (spent / budget) * 100 : 0;
  const remainingBudget = budget - spent;
  const isOverBudget = spent > budget;

  useEffect(() => {
    if (!editing) {
      setInputValue(budget.toString());
    }
  }, [budget, editing]);

  const handleUpdate = () => {
    const newBudgetValue = parseFloat(inputValue);
    if (isNaN(newBudgetValue) || newBudgetValue < 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid positive number.",
        variant: "destructive",
      });
      return;
    }
    onUpdate(event, newBudgetValue);
    setEditing(false);
    toast({
      title: "Budget Updated",
      description: `Budget for ${event} set to ₦${newBudgetValue.toLocaleString()}`,
    });
  };

  return (
    <Card className="shadow-lg mt-6">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="font-headline text-lg flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            Budget vs Spending for {event}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing(!editing)}
          >
            <Edit3Icon className="mr-2 h-4 w-4" />
            {editing ? "Cancel" : "Edit Budget"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-primary">₦</span>
              <Input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter new budget"
                className="text-xl font-bold text-primary"
              />
              <Button onClick={handleUpdate} size="sm">
                <Save className="mr-2 h-4 w-4" /> Set Budget
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              Current spending: ₦{spent.toLocaleString()} •{" "}
              {spendingPercentage.toFixed(1)}% of proposed budget
            </div>
          </div>
        ) : (
          <>
            {/* Budget Summary Row */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <p className="text-sm font-medium text-muted-foreground">
                  Budget
                </p>
                <p className="text-2xl font-bold text-primary">
                  ₦{budget.toLocaleString()}
                </p>
              </div>
              <div
                className={`text-center p-3 ${
                  isOverBudget ? "bg-destructive/10" : "bg-secondary/30"
                } rounded-lg`}
              >
                <p className="text-sm font-medium text-muted-foreground">
                  Spent
                </p>
                <p
                  className={`text-2xl font-bold ${
                    isOverBudget ? "text-destructive" : "text-foreground"
                  }`}
                >
                  ₦{spent.toLocaleString()}
                </p>
              </div>
              <div
                className={`text-center p-3 ${
                  remainingBudget < 0 ? "bg-destructive/10" : "bg-accent/10"
                } rounded-lg`}
              >
                <p className="text-sm font-medium text-muted-foreground">
                  Remaining
                </p>
                <p
                  className={`text-2xl font-bold ${
                    remainingBudget < 0 ? "text-destructive" : "text-accent"
                  }`}
                >
                  ₦{remainingBudget.toLocaleString()}
                </p>
              </div>
            </div>

            {/* Progress Bar with Clear Labels */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Spending Progress</span>
                  <Badge
                    variant={
                      isOverBudget
                        ? "destructive"
                        : spendingPercentage > 80
                        ? "default"
                        : "secondary"
                    }
                  >
                    {spendingPercentage.toFixed(1)}%
                  </Badge>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {isOverBudget ? (
                    <div className="flex items-center text-destructive">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>
                        Over budget by ₦
                        {Math.abs(remainingBudget).toLocaleString()}
                      </span>
                    </div>
                  ) : spendingPercentage > 80 ? (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      <span>Approaching budget limit</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-600">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      <span>On track</span>
                    </div>
                  )}
                </div>
              </div>

              <div
                className={cn(
                  "relative h-3 w-full overflow-hidden rounded-full",
                  isOverBudget ? "bg-destructive/20" : "bg-secondary"
                )}
              >
                <Progress
                  value={Math.min(spendingPercentage, 100)}
                  className={cn(
                    "h-full",
                    isOverBudget
                      ? "bg-destructive"
                      : spendingPercentage > 80
                      ? "bg-amber-500"
                      : "bg-primary"
                  )}
                />
              </div>

              <div className="flex justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span>₦0</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center">
                    <div className="w-3 h-3 rounded-full bg-accent"></div>
                    <span>Current: ₦{spent.toLocaleString()}</span>
                  </div>
                  <div className="text-[10px]">
                    ({spendingPercentage.toFixed(1)}% of budget)
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Budget: ₦{budget.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Budget Health Indicator */}
            <div
              className={`mt-4 p-3 rounded-lg ${
                isOverBudget
                  ? "bg-destructive/10 border border-destructive/20"
                  : "bg-secondary/20"
              }`}
            >
              <div className="flex items-start gap-2">
                {isOverBudget ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                    <div>
                      <p className="font-medium text-destructive">
                        Budget Exceeded
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You have spent ₦
                        {Math.abs(remainingBudget).toLocaleString()} more than
                        your budget. Consider adjusting your budget or reviewing
                        expenses.
                      </p>
                    </div>
                  </>
                ) : spendingPercentage > 80 ? (
                  <>
                    <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-600">
                        Approaching Budget Limit
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You've used {spendingPercentage.toFixed(1)}% of your
                        budget. Only ₦{remainingBudget.toLocaleString()}{" "}
                        remaining.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-green-600">
                        Budget Healthy
                      </p>
                      <p className="text-sm text-muted-foreground">
                        You have ₦{remainingBudget.toLocaleString()} remaining (
                        {Math.max(0, 100 - spendingPercentage).toFixed(1)}% of
                        budget left).
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function BudgetPage() {
  const events = mockWeddingDetails.events;
  const { toast } = useToast();

  const [activeEvent, setActiveEvent] = useState(events[0]);

  // Storage keys for local storage
  const EXPENSES_STORAGE_KEY = "tangelo-wedding-expenses";
  const EVENT_BUDGETS_STORAGE_KEY = "tangelo-wedding-event-budgets";

  // Initialize event budgets from localStorage or default values
  const initialEventBudgets = useMemo(() => {
    if (typeof window === "undefined") {
      // Default split if no localStorage
      const defaultBudgets: Record<string, number> = {};
      events.forEach((event, index) => {
        const share =
          index === events.length - 1
            ? mockBudget.total -
              Object.values(defaultBudgets).reduce((sum, b) => sum + b, 0)
            : Math.floor(mockBudget.total / events.length);
        defaultBudgets[event] = share;
      });
      return defaultBudgets;
    }

    const stored = localStorage.getItem(EVENT_BUDGETS_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (error) {
        console.error("Error parsing stored event budgets:", error);
      }
    }

    // Default split if no valid localStorage data
    const defaultBudgets: Record<string, number> = {};
    events.forEach((event, index) => {
      const share =
        index === events.length - 1
          ? mockBudget.total -
            Object.values(defaultBudgets).reduce((sum, b) => sum + b, 0)
          : Math.floor(mockBudget.total / events.length);
      defaultBudgets[event] = share;
    });
    return defaultBudgets;
  }, [events]);

  // Initialize expenses from localStorage or mock data
  const initialExpenses = useMemo(() => {
    if (typeof window === "undefined") return mockExpenses;

    const stored = localStorage.getItem(EXPENSES_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        // Convert date strings back to Date objects
        return parsed.map((expense: any) => ({
          ...expense,
          date: new Date(expense.date),
        }));
      } catch (error) {
        console.error("Error parsing stored expenses:", error);
      }
    }
    return mockExpenses;
  }, []);

  const [eventBudgets, setEventBudgets] =
    useState<Record<string, number>>(initialEventBudgets);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  // Save eventBudgets to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(
        EVENT_BUDGETS_STORAGE_KEY,
        JSON.stringify(eventBudgets)
      );
    }
  }, [eventBudgets]);

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== "undefined" && expenses.length > 0) {
      // Convert Date objects to ISO strings for storage
      const expensesForStorage = expenses.map((expense) => ({
        ...expense,
        date: expense.date.toISOString(),
      }));
      localStorage.setItem(
        EXPENSES_STORAGE_KEY,
        JSON.stringify(expensesForStorage)
      );
    }
  }, [expenses]);

  // Calculate spent amounts for each event
  const spentByEvent = useMemo(() => {
    const spent: Record<string, number> = {};
    events.forEach((event) => {
      spent[event] = expenses
        .filter((e) => e.event === event)
        .reduce((sum, expense) => sum + expense.amount, 0);
    });
    return spent;
  }, [expenses, events]);

  const totalBudget = useMemo(
    () => Object.values(eventBudgets).reduce((sum, budget) => sum + budget, 0),
    [eventBudgets]
  );
  const totalSpent = useMemo(
    () => Object.values(spentByEvent).reduce((sum, spent) => sum + spent, 0),
    [spentByEvent]
  );
  const overallSpendingPercentage =
    totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudgetOverall = totalSpent > totalBudget;

  const handleBudgetUpdate = (event: string, newBudget: number) => {
    setEventBudgets((prev) => ({
      ...prev,
      [event]: newBudget,
    }));
  };

  const handleAddExpense = async (formData: FormData) => {
    const newExpense = {
      id: `e${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      amount: parseFloat(formData.get("amount") as string),
      date: new Date(),
      event: formData.get("event") as string,
    };
    setExpenses((prev) => [...prev, newExpense]);
    toast({
      title: "Success",
      description: "Expense added and saved to your browser.",
    });
    return true;
  };

  const handleUpdateExpense = async (id: string, formData: FormData) => {
    const updatedExpense = {
      name: formData.get("name") as string,
      category: formData.get("category") as string,
      amount: parseFloat(formData.get("amount") as string),
      event: formData.get("event") as string,
    };
    setExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updatedExpense } : e))
    );
    toast({
      title: "Success",
      description: "Expense updated and saved to your browser.",
    });
    return true;
  };

  const handleDeleteExpense = async (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
    toast({
      title: "Success",
      description: "Expense deleted and saved to your browser.",
    });
  };

  const handleExportCSV = () => {
    try {
      // Create CSV content for event budgets
      let csvContent = "Tangelo Wedding Budget Export\n";
      csvContent += "Generated: " + new Date().toLocaleDateString() + "\n\n";

      // Event Budgets Section
      csvContent += "EVENT BUDGETS\n";
      csvContent += "Event,Budget (₦),Spent (₦),Remaining (₦),Spending %\n";

      events.forEach((event) => {
        const budget = eventBudgets[event] || 0;
        const spent = spentByEvent[event] || 0;
        const remaining = budget - spent;
        const percentage =
          budget > 0 ? ((spent / budget) * 100).toFixed(2) : "0.00";

        csvContent += `"${event}",${budget},${spent},${remaining},${percentage}%\n`;
      });

      csvContent += `\nTOTAL,${totalBudget},${totalSpent},${
        totalBudget - totalSpent
      },${overallSpendingPercentage.toFixed(2)}%\n\n`;

      // Expenses Section
      csvContent += "EXPENSES\n";
      csvContent += "Event,Expense Name,Category,Amount (₦),Date\n";

      expenses.forEach((expense) => {
        const date = new Date(expense.date).toLocaleDateString();
        csvContent += `"${expense.event}","${expense.name}","${expense.category}",${expense.amount},"${date}"\n`;
      });

      // Calculate summary by category
      csvContent += "\nSUMMARY BY CATEGORY\n";
      csvContent += "Category,Total Amount (₦),Number of Expenses\n";

      const categorySummary: Record<string, { total: number; count: number }> =
        {};
      expenses.forEach((expense) => {
        if (!categorySummary[expense.category]) {
          categorySummary[expense.category] = { total: 0, count: 0 };
        }
        categorySummary[expense.category].total += expense.amount;
        categorySummary[expense.category].count += 1;
      });

      Object.entries(categorySummary).forEach(([category, data]) => {
        csvContent += `"${category}",${data.total},${data.count}\n`;
      });

      // Create and download CSV file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `tangelo-wedding-budget-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Successful",
        description: "Budget data has been exported to CSV file.",
      });
    } catch (error) {
      console.error("Error exporting CSV:", error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the budget data.",
        variant: "destructive",
      });
    }
  };

  const filteredExpenses = useMemo(
    () => expenses.filter((e) => e.event === activeEvent),
    [expenses, activeEvent]
  );
  const expenseCategories = useMemo(
    () => Array.from(new Set(filteredExpenses.map((e) => e.category))),
    [filteredExpenses]
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Smart Budgeting"
        description="Track your wedding expenses and monitor spending against your budget for each event. All data is saved in your browser."
        icon={Banknote}
      >
        <Button onClick={handleExportCSV} variant="outline" className="ml-2">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </PageHeader>

      {/* Overall Wedding Budget Summary */}
      <Card className="shadow-xl border-primary/20">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Overall Wedding Budget Summary
          </CardTitle>
          <CardDescription>
            View your total budget, spending, and remaining balance across all
            events
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-primary/10 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Budget
              </p>
              <p className="text-3xl font-bold text-primary">
                ₦{totalBudget.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Across {events.length} events
              </p>
            </div>
            <div className="text-center p-4 bg-secondary/30 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Total Spent
              </p>
              <p
                className={`text-3xl font-bold ${
                  isOverBudgetOverall ? "text-destructive" : "text-foreground"
                }`}
              >
                ₦{totalSpent.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {overallSpendingPercentage.toFixed(1)}% of total budget
              </p>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-xl">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Remaining Balance
              </p>
              <p
                className={`text-3xl font-bold ${
                  totalBudget - totalSpent < 0
                    ? "text-destructive"
                    : "text-accent"
                }`}
              >
                ₦{(totalBudget - totalSpent).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {Math.max(0, 100 - overallSpendingPercentage).toFixed(1)}% of
                budget remaining
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Overall Spending Progress
              </span>
              <Badge
                variant={
                  isOverBudgetOverall
                    ? "destructive"
                    : overallSpendingPercentage > 80
                    ? "default"
                    : "secondary"
                }
              >
                {overallSpendingPercentage.toFixed(1)}%
              </Badge>
            </div>
            <div
              className={cn(
                "relative h-3 w-full overflow-hidden rounded-full",
                isOverBudgetOverall ? "bg-destructive/20" : "bg-secondary"
              )}
            >
              <Progress
                value={Math.min(overallSpendingPercentage, 100)}
                className={cn(
                  "h-full",
                  isOverBudgetOverall
                    ? "bg-destructive"
                    : overallSpendingPercentage > 80
                    ? "bg-amber-500"
                    : "bg-primary"
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>₦0</span>
              <span className="font-medium">
                Current: ₦{totalSpent.toLocaleString()}
              </span>
              <span>₦{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeEvent}
        onValueChange={setActiveEvent}
        className="w-full"
      >
        <TabsList className={`grid w-full grid-cols-${events.length}`}>
          {events.map((event) => (
            <TabsTrigger key={event} value={event}>
              {event}
            </TabsTrigger>
          ))}
        </TabsList>
        {events.map((event) => (
          <TabsContent key={event} value={event} className="space-y-6 mt-6">
            <EventBudgetEditor
              event={event}
              budget={eventBudgets[event] || 0}
              spent={spentByEvent[event] || 0}
              onUpdate={handleBudgetUpdate}
            />
            <BudgetChart
              expenses={expenses.filter((e) => e.event === event)}
              totalBudget={eventBudgets[event] || 0}
            />
            <ExpenseTracker
              expenses={expenses.filter((e) => e.event === event)}
              categories={expenseCategories}
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              onDeleteExpense={handleDeleteExpense}
              currentEvent={event}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
