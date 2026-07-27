"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ClipboardCheckIcon,
  ArrowRight,
  ArrowLeft,
  PlusCircle,
  Trash2,
  Crown,
  Banknote,
  MapPin,
  Users,
  CalendarIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const steps = [
  { id: "names", title: "Welcome! Who is getting married?" },
  { id: "events", title: "Tell us about your events" },
  { id: "budget", title: "What's your budget?" },
  { id: "details", title: "A few more details" },
];

const nigerianWeddingEvents = [
  "Traditional Wedding",
  "White Wedding Ceremony",
  "Nikah Ceremony",
  "Wedding Reception",
  "Introduction Ceremony",
  "Bridal Shower",
  "Engagement Party",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    userFirstName: "Tunde",
    userLastName: "Adebayo",
    partnerFirstName: "Adanna",
    partnerLastName: "Okoro",
    events: [
      {
        name: "Traditional Wedding",
        budget: "4000000",
        location: "Lagos, NG",
        guestCount: "100-300",
        date: new Date(),
      },
      {
        name: "White Wedding Reception",
        budget: "3500000",
        location: "Lagos, NG",
        guestCount: "100-300",
        date: new Date(),
      },
    ],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEventChange = (
    index: number,
    field: "name" | "budget" | "location" | "guestCount",
    value: string
  ) => {
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], [field]: value };
    setFormData((prev) => ({ ...prev, events: newEvents }));
  };

  const handleDateChange = (index: number, date: Date | undefined) => {
    if (!date) return;
    const newEvents = [...formData.events];
    newEvents[index] = { ...newEvents[index], date };
    setFormData((prev) => ({ ...prev, events: newEvents }));
  };

  const addEvent = () => {
    if (formData.events.length >= 2) return;
    setFormData((prev) => ({
      ...prev,
      events: [
        ...prev.events,
        {
          name: "",
          budget: "0",
          location: "Lagos, NG",
          guestCount: "100-300",
          date: new Date(),
        },
      ],
    }));
  };

  const removeEvent = (index: number) => {
    if (formData.events.length <= 1) return;
    const newEvents = formData.events.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, events: newEvents }));
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // This is the final submission
      console.log("Onboarding complete (demo):", formData);
      toast({
        title: "Setup Complete! (Demo)",
        description:
          "Your wedding plan has been personalized with our demo data.",
      });
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;
  const canAddMoreEvents = formData.events.length < 2;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Setting up your Wedding Plan"
        description="This information will help us personalize your wedding planning experience."
        icon={ClipboardCheckIcon}
      />
      <Card className="max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              Step {currentStep + 1} of {steps.length}:{" "}
              {steps[currentStep].title}
            </p>
          </div>
        </CardHeader>
        <form onSubmit={handleNext}>
          <CardContent className="min-h-[350px]">
            {currentStep === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <h3 className="md:col-span-2 text-lg font-semibold text-primary">
                  Your Details
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="userFirstName">Your First Name</Label>
                  <Input
                    id="userFirstName"
                    name="userFirstName"
                    value={formData.userFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="userLastName">Your Last Name</Label>
                  <Input
                    id="userLastName"
                    name="userLastName"
                    value={formData.userLastName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <h3 className="md:col-span-2 text-lg font-semibold text-primary pt-4">
                  Your Partner's Details
                </h3>
                <div className="space-y-2">
                  <Label htmlFor="partnerFirstName">Partner's First Name</Label>
                  <Input
                    id="partnerFirstName"
                    name="partnerFirstName"
                    value={formData.partnerFirstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partnerLastName">Partner's Last Name</Label>
                  <Input
                    id="partnerLastName"
                    name="partnerLastName"
                    value={formData.partnerLastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}
            {currentStep === 1 && (
              <div className="space-y-4">
                {formData.events.map((event, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`event-name-${index}`}>
                      Event Name #{index + 1}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <Select
                        name={`event-name-${index}`}
                        value={event.name}
                        onValueChange={(value) =>
                          handleEventChange(index, "name", value)
                        }
                        required
                      >
                        <SelectTrigger id={`event-name-${index}`}>
                          <SelectValue placeholder="Select an event type" />
                        </SelectTrigger>
                        <SelectContent>
                          {nigerianWeddingEvents.map((eventType) => (
                            <SelectItem key={eventType} value={eventType}>
                              {eventType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {formData.events.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeEvent(index)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEvent}
                  disabled={!canAddMoreEvents}
                >
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Another Event
                </Button>
                {!canAddMoreEvents && (
                  <Alert
                    variant="default"
                    className="bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700"
                  >
                    <Crown className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="font-semibold text-yellow-800 dark:text-yellow-200">
                      Premium Feature
                    </AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-300">
                      Planning more than two events is a premium feature. This
                      is a demo, so feel free to continue!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Alert>
                  <Banknote className="h-4 w-4" />
                  <AlertTitle>Set Your Budgets</AlertTitle>
                  <AlertDescription>
                    Enter an estimated budget for each of your wedding events.
                    You can always change this later.
                  </AlertDescription>
                </Alert>
                {formData.events.map((event, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`budget-${index}`}>
                      Budget for {event.name || `Event #${index + 1}`}
                    </Label>
                    <div className="flex items-center space-x-2">
                      <span className="pl-3 text-muted-foreground">₦</span>
                      <Input
                        id={`budget-${index}`}
                        name={`budget-${index}`}
                        type="number"
                        value={event.budget}
                        onChange={(e) =>
                          handleEventChange(index, "budget", e.target.value)
                        }
                        placeholder="e.g., 5000000"
                        required
                        className="pl-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
            {currentStep === 3 && (
              <div className="space-y-6">
                {formData.events.map((event, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-4">
                    <h4 className="font-semibold text-primary">
                      {event.name || `Event #${index + 1}`}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`location-${index}`}>
                          <MapPin className="inline-block mr-2 h-4 w-4" />
                          Location
                        </Label>
                        <Select
                          name={`location-${index}`}
                          value={event.location}
                          onValueChange={(value) =>
                            handleEventChange(index, "location", value)
                          }
                        >
                          <SelectTrigger id={`location-${index}`}>
                            <SelectValue placeholder="Select a location" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lagos, NG">Lagos</SelectItem>
                            <SelectItem value="Abuja, NG">Abuja</SelectItem>
                            <SelectItem value="Port Harcourt, NG">
                              Port Harcourt
                            </SelectItem>
                            <SelectItem value="Ibadan, NG">Ibadan</SelectItem>
                            <SelectItem value="Other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`guestCount-${index}`}>
                          <Users className="inline-block mr-2 h-4 w-4" />
                          Guest Count
                        </Label>
                        <Select
                          name={`guestCount-${index}`}
                          value={event.guestCount}
                          onValueChange={(value) =>
                            handleEventChange(index, "guestCount", value)
                          }
                        >
                          <SelectTrigger id={`guestCount-${index}`}>
                            <SelectValue placeholder="Select number of guests" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-100">
                              0 - 100 guests
                            </SelectItem>
                            <SelectItem value="100-300">
                              100 - 300 guests
                            </SelectItem>
                            <SelectItem value="300-500">
                              300 - 500 guests
                            </SelectItem>
                            <SelectItem value="500+">500+ guests</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`date-${index}`}>
                          <CalendarIcon className="inline-block mr-2 h-4 w-4" />
                          Event Date
                        </Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !event.date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {event.date ? (
                                format(event.date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={event.date}
                              onSelect={(date) => handleDateChange(index, date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentStep > 0 ? (
              <Button type="button" variant="outline" onClick={handleBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            ) : (
              <div /> // Placeholder to keep "Next" on the right
            )}
            <Button type="submit">
              {currentStep === steps.length - 1 ? "Finish Setup" : "Next"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
