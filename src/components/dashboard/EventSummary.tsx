
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpenCheck, MapPin, PartyPopper, CalendarPlus } from 'lucide-react';
import type { Wedding } from '@/lib/types';

interface EventSummaryProps {
  wedding: Wedding;
}

const InfoPill = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null | undefined }) => {
  if (!value) return null;

  return (
    <div className="flex items-start space-x-3 bg-secondary/30 p-3 rounded-lg h-full">
      <Icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
      <div>
        <p className="text-sm font-semibold text-muted-foreground">{label}</p>
        <p className="text-md font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default function EventSummary({ wedding }: EventSummaryProps) {
  const eventIcons = [BookOpenCheck, PartyPopper, CalendarPlus];

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-xl">Key Event Details</CardTitle>
        <CardDescription>
          Here are the main events you're planning.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {wedding.events.map((event, index) => (
          <InfoPill
            key={index}
            icon={eventIcons[index % eventIcons.length]} // Cycle through icons
            label={`Event #${index + 1}`}
            value={event}
          />
        ))}
         <InfoPill
          icon={MapPin}
          label="Location"
          value={wedding.location}
        />
      </CardContent>
    </Card>
  );
}
