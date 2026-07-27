
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerIcon, PartyPopper } from 'lucide-react';
import { isFuture, differenceInSeconds } from 'date-fns';
import type { WeddingEvent } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';

interface WeddingCountdownProps {
  events: WeddingEvent[];
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownDisplay = ({ targetDate, name }: { targetDate: Date, name: string }) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = differenceInSeconds(targetDate, new Date());
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (60 * 60 * 24)),
          hours: Math.floor((difference / (60 * 60)) % 24),
          minutes: Math.floor((difference / 60) % 60),
          seconds: Math.floor(difference % 60),
        });
      } else {
        setTimeLeft(null); // Event is in the past
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft || !isFuture(targetDate)) {
    return (
      <div className="text-center p-4 bg-secondary/50 rounded-lg shadow">
        <h4 className="font-semibold text-primary">{name}</h4>
        <div className="flex items-center justify-center text-lg font-bold text-green-600 mt-2">
            <PartyPopper className="h-5 w-5 mr-2"/>
            Congratulations!
        </div>
      </div>
    );
  }
  
  const countdownItems = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ];

  return (
     <div className="text-center p-4 bg-secondary/50 rounded-lg shadow">
        <h4 className="font-semibold text-primary mb-2">{name}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {countdownItems.map(item => (
            <div key={item.label} className="bg-background/50 p-2 rounded-md">
                <div className="text-2xl font-bold text-primary">{item.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</div>
            </div>
            ))}
        </div>
     </div>
  );
};


export default function WeddingCountdown({ events }: WeddingCountdownProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <Card>
        <CardHeader>
             <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  const sortedEvents = [...events].sort((a,b) => a.date.getTime() - b.date.getTime());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium font-headline flex items-center">
            <TimerIcon className="h-5 w-5 mr-2 text-primary" />
            Wedding Countdowns
        </CardTitle>
        <CardDescription>Here's the time remaining until your big events!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedEvents.map(event => (
            <CountdownDisplay key={event.name} name={event.name} targetDate={event.date} />
        ))}
      </CardContent>
    </Card>
  );
}
