"use client";

import type { Guest } from "@/lib/types";
import type { TableDefinition } from "./TableManager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserIcon, UsersIcon, AlertCircle } from "lucide-react";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface SeatingChartDisplayProps {
  guests: Guest[];
  tables: TableDefinition[];
}

export default function SeatingChartDisplay({
  guests,
  tables,
}: SeatingChartDisplayProps) {
  const tableAssignments = useMemo(() => {
    // Group guests by tableId, only accepted guests are seated
    const acceptedGuests = guests.filter((g) => g.rsvp_status === "Accepted");
    const map = new Map<string, Guest[]>();
    acceptedGuests.forEach((guest) => {
      if (guest.tableId) {
        if (!map.has(guest.tableId)) {
          map.set(guest.tableId, []);
        }
        map.get(guest.tableId)!.push(guest);
      }
    });
    return map;
  }, [guests]);

  const tablesWithGuests = useMemo(() => {
    return tables.map((table) => ({
      ...table,
      assigned: tableAssignments.get(table.id) || [],
      occupancy: (tableAssignments.get(table.id) || []).length,
    }));
  }, [tables, tableAssignments]);

  const totalAssigned = tablesWithGuests.reduce(
    (sum, t) => sum + t.occupancy,
    0
  );
  const totalAccepted = guests.filter(
    (g) => g.rsvp_status === "Accepted"
  ).length;
  const unassignedAccepted = totalAccepted - totalAssigned;

  if (tables.length === 0) {
    return (
      <div className="text-center py-10">
        <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
        <p className="mt-4 text-muted-foreground">
          No tables have been defined for this event.
        </p>
        <p className="text-sm text-muted-foreground">
          Use the table manager above to create tables.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-muted/20 rounded-lg">
        {tablesWithGuests.map((table) => {
          const isOverCapacity = table.occupancy > table.capacity;
          return (
            <Card
              key={table.id}
              className={cn(
                "shadow-md hover:shadow-lg transition-shadow flex flex-col",
                isOverCapacity && "border-destructive border-2"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-lg text-primary">
                    {table.name}
                  </CardTitle>
                  {isOverCapacity && (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  )}
                </div>
                <CardDescription className="text-xs">
                  {table.occupancy} / {table.capacity} guests
                  {isOverCapacity && " (over capacity!)"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow space-y-2 pt-2 overflow-y-auto max-h-60">
                {table.assigned.length > 0 ? (
                  <ul className="space-y-1">
                    {table.assigned.map((guest) => (
                      <li
                        key={guest.id}
                        className="text-sm text-foreground flex items-center"
                      >
                        <UserIcon className="h-3 w-3 mr-2 shrink-0 text-accent" />
                        {guest.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No guests assigned
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {unassignedAccepted > 0 && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg p-4 text-center">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ {unassignedAccepted} accepted guest
            {unassignedAccepted !== 1 ? "s" : ""} not assigned to any table.
          </p>
        </div>
      )}
    </div>
  );
}
