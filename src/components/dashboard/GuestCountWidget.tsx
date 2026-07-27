
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UsersIcon, ArrowRightIcon } from 'lucide-react';

interface GuestCountWidgetProps {
  totalGuests: number;
  acceptedGuests: number;
}

export default function GuestCountWidget({ totalGuests, acceptedGuests }: GuestCountWidgetProps) {

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
         <div className="flex items-center">
            <UsersIcon className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-lg font-headline">Guest Overview</CardTitle>
        </div>
        <Link href="/guests" passHref>
          <Button variant="ghost" size="sm">
            Manage <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold text-primary">{totalGuests}</p>
        <p className="text-xs text-muted-foreground">Total Guests Invited</p>
        <p className="mt-2 text-sm text-green-600 font-semibold">{acceptedGuests} Attending</p>
      </CardContent>
    </Card>
  );
}
