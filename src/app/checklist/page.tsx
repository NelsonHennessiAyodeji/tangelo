"use client";

import {
  useState,
  type FormEvent,
  useMemo,
  useActionState,
  useEffect,
} from "react";
import type { Task } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  ListChecksIcon,
  PlusCircleIcon,
  CalendarIcon,
  Edit2Icon,
  Trash2Icon,
  SaveIcon,
  XIcon,
  SparklesIcon,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { mockTasks, mockWeddingDetails } from "@/lib/mockData";
import {
  getAITaskSuggestions,
  type AIResponseState,
} from "@/actions/checklistActions";
import { Badge } from "@/components/ui/badge";

const STORAGE_KEY = "tangelo-wedding-tasks";

// Helper function to load tasks from localStorage
const loadTasksFromStorage = (): Task[] => {
  if (typeof window === "undefined") return mockTasks;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert date strings back to Date objects
      return parsed.map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      }));
    }
  } catch (error) {
    console.error("Error loading tasks from localStorage:", error);
  }

  return mockTasks;
};

// Helper function to save tasks to localStorage
const saveTasksToStorage = (tasks: Task[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

// OverallProgress component
const OverallProgress = ({ tasks }: { tasks: Task[] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (totalTasks === 0) return null;

  return (
    <div className="flex items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2">
      <CheckCircle2 className="h-4 w-4 text-primary" />
      <div className="flex flex-col min-w-[120px]">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Overall</span>
          <span className="font-medium">
            {completedTasks}/{totalTasks}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-1.5 w-full" />
      </div>
      <Badge variant="outline" className="ml-1">
        {Math.round(progressPercentage)}%
      </Badge>
    </div>
  );
};

export default function ChecklistPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const { toast } = useToast();

  const events = mockWeddingDetails.events;
  const [activeEvent, setActiveEvent] = useState(events[0]);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const loadedTasks = loadTasksFromStorage();
    setTasks(loadedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasksToStorage(tasks);
    }
  }, [tasks]);

  // AI Task Suggestions Action
  const [aiState, getSuggestionsAction, isPending] = useActionState<
    AIResponseState,
    FormData
  >(getAITaskSuggestions, { message: "" });

  useEffect(() => {
    if (aiState.data?.tasks && aiState.data.tasks.length > 0) {
      const newTasks = aiState.data.tasks.map((task, index) => ({
        id: `ai-task-${Date.now()}-${index}`,
        name: task.name,
        description: task.description,
        completed: false,
        // Distribute tasks between the two main events for demo purposes
        event: index % 2 === 0 ? events[0] : events[1] || events[0],
      }));

      setTasks((prev) => {
        const updatedTasks = [...prev, ...newTasks];
        return updatedTasks;
      });
      toast({
        title: "AI Suggestions Added!",
        description: "New tasks have been added to your checklist.",
      });
    } else if (aiState.message && !aiState.errors && !isPending) {
      toast({
        title: "AI Assistant",
        description: aiState.message,
        variant: aiState.data ? "default" : "destructive",
      });
    }
  }, [aiState, toast, events, isPending]);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.event === activeEvent),
    [tasks, activeEvent]
  );

  const completedTasks = filteredTasks.filter((task) => task.completed).length;
  const totalTasks = filteredTasks.length;
  const progressPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!taskName) {
      toast({
        title: "Error",
        description: "Task name is required.",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      const updatedTaskData: Task = {
        ...editingTask,
        name: taskName,
        description: taskDescription,
        dueDate,
        event: activeEvent,
      };

      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === editingTask.id ? updatedTaskData : t))
      );

      toast({ title: "Success", description: `Task "${taskName}" updated.` });
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: taskName,
        description: taskDescription,
        dueDate,
        completed: false,
        event: activeEvent,
      };

      setTasks((prev) => [...prev, newTask]);
      toast({ title: "Success", description: `Task "${taskName}" added.` });
    }
    resetForm();
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setTaskName("");
    setTaskDescription("");
    setDueDate(undefined);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setTaskName(task.name);
    setTaskDescription(task.description || "");
    setDueDate(task.dueDate);
    setShowForm(true);
  };

  const handleDeleteTask = async (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
    toast({ title: "Success", description: "Task deleted." });
  };

  const handleToggleTask = async (task: Task) => {
    const updatedTask = { ...task, completed: !task.completed };

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t.id === task.id ? updatedTask : t))
    );
  };

  const handleResetAllTasks = () => {
    setTasks(mockTasks);
    toast({
      title: "Tasks Reset",
      description: "All tasks have been reset to default.",
      variant: "default",
    });
  };

  const renderContent = (tasksToRender: Task[]) => (
    <div className="space-y-3 max-h-[calc(100vh-25rem)] overflow-y-auto pr-2">
      {tasksToRender
        .sort((a, b) => {
          // Sort by due date (if available), then by completion status
          const aDate = a.dueDate?.getTime() || Infinity;
          const bDate = b.dueDate?.getTime() || Infinity;
          if (aDate !== bDate) return aDate - bDate;
          return (a.completed ? 1 : 0) - (b.completed ? 1 : 0);
        })
        .map((task) => (
          <div
            key={task.id}
            className="flex items-start space-x-3 p-3 bg-secondary/30 rounded-md hover:bg-secondary/50 transition-colors"
          >
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => handleToggleTask(task)}
              className="mt-1"
            />
            <div className="flex-grow">
              <Label
                htmlFor={`task-${task.id}`}
                className={`font-medium text-sm ${
                  task.completed
                    ? "line-through text-muted-foreground"
                    : "text-foreground"
                }`}
              >
                {task.name}
              </Label>
              {task.description && (
                <p
                  className={`text-xs ${
                    task.completed
                      ? "line-through text-muted-foreground/80"
                      : "text-muted-foreground"
                  }`}
                >
                  {task.description}
                </p>
              )}
              {task.dueDate && (
                <p
                  className={`text-xs mt-1 ${
                    task.completed ? "text-muted-foreground/70" : "text-accent"
                  }`}
                >
                  Due: {format(task.dueDate, "PP")}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => handleEdit(task)}
              >
                <Edit2Icon className="h-4 w-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive/90"
                  >
                    <Trash2Icon className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Task?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete the task "{task.name}"?
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDeleteTask(task.id)}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))}
      {tasksToRender.length === 0 && !showForm && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">
            No tasks for this event yet.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Your First Task
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Wedding Checklist"
        description="Manage all your wedding tasks and track your progress for each event. All tasks are saved in your browser."
        icon={ListChecksIcon}
      >
        <div className="flex items-center gap-4">
          <OverallProgress tasks={tasks} />
          <div className="flex items-center gap-2">
            <form action={getSuggestionsAction}>
              <Button
                size="sm"
                variant="outline"
                type="submit"
                disabled={isPending}
              >
                <SparklesIcon className="mr-2 h-4 w-4" />
                {isPending ? "Getting suggestions..." : "Get AI Suggestions"}
              </Button>
            </form>
            <Button
              size="sm"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <PlusCircleIcon className="mr-2 h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
      </PageHeader>

      <div className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Showing tasks for{" "}
          <span className="font-medium text-foreground">{activeEvent}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetAllTasks}>
          Reset to Default Tasks
        </Button>
      </div>

      <Card className="shadow-xl">
        <CardContent className="pt-6">
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

            <div className="my-4">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-muted-foreground">
                  Progress for {activeEvent}
                </p>
                <p className="text-sm font-medium">
                  {completedTasks} of {totalTasks} tasks
                </p>
              </div>
              <Progress value={progressPercentage} className="w-full h-3" />
            </div>

            {showForm && (
              <form
                onSubmit={handleFormSubmit}
                className="mb-6 p-4 border rounded-lg bg-card space-y-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">
                    {editingTask
                      ? `Edit Task for ${activeEvent}`
                      : `Add New Task for ${activeEvent}`}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={resetForm}
                    className="h-8 w-8"
                  >
                    <XIcon className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label htmlFor="taskName">Task Name*</Label>
                  <Input
                    id="taskName"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    placeholder="e.g., Book venue"
                  />
                </div>
                <div>
                  <Label htmlFor="taskDescription">Description</Label>
                  <Textarea
                    id="taskDescription"
                    value={taskDescription}
                    onChange={(e) => setTaskDescription(e.target.value)}
                    placeholder="e.g., Confirm availability and make deposit"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={`w-full justify-start text-left font-normal ${
                          !dueDate && "text-muted-foreground"
                        }`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dueDate ? (
                          format(dueDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dueDate}
                        onSelect={setDueDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    size="sm"
                  >
                    <XIcon className="mr-1 h-4 w-4" />
                    Cancel
                  </Button>
                  <Button type="submit" size="sm">
                    <SaveIcon className="mr-1 h-4 w-4" />
                    {editingTask ? "Update Task" : "Save Task"}
                  </Button>
                </div>
              </form>
            )}

            {renderContent(filteredTasks)}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
