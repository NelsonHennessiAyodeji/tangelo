
'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ArrowRightIcon } from 'lucide-react';
import { useSelectedVendors } from '@/hooks/use-selected-vendors';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyVendorsWidget() {
  const { selectedVendors, isLoaded } = useSelectedVendors();

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
         <div className="flex items-center">
            <Heart className="h-6 w-6 mr-2 text-primary" />
            <CardTitle className="text-lg font-headline">My Vendors</CardTitle>
        </div>
        <Link href="/vendors/my-vendors" passHref>
          <Button variant="ghost" size="sm">
            View List <ArrowRightIcon className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        {!isLoaded ? (
            <div className="space-y-2">
                <Skeleton className="h-8 w-10" />
                <Skeleton className="h-4 w-24" />
            </div>
        ) : (
            <>
                <p className="text-3xl font-bold text-primary">{selectedVendors.length}</p>
                <p className="text-xs text-muted-foreground">Vendors Saved</p>
            </>
        )}
      </CardContent>
    </Card>
  );
}
