"use client";

import { useState, useMemo, useEffect } from "react";
import type { Guest } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import GuestManagement from "@/components/guests/GuestManagement";
import SeatingChartDisplay from "@/components/guests/SeatingChartDisplay";
import TableManager, {
  TableDefinition,
} from "@/components/guests/TableManager";
import { ClipboardListIcon, LayoutGridIcon, TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { mockGuests, mockWeddingDetails } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [tables, setTables] = useState<Record<string, TableDefinition[]>>({}); // keyed by event
  const [showSeatingChart, setShowSeatingChart] = useState(false);
  const [showTableManager, setShowTableManager] = useState(false); // new state
  const { toast } = useToast();

  const events = mockWeddingDetails.events;
  const [activeEvent, setActiveEvent] = useState(events[0]);

  // Load guests from mock data on mount
  useEffect(() => {
    const initialGuests: Guest[] = mockGuests.map((g) => ({
      id: g.id,
      name: g.name,
      rsvp_status: g.rsvp_status,
      dietary_restrictions: g.dietary_restrictions,
      tableId: undefined,
      event: g.event,
    }));
    setGuests(initialGuests);
  }, []);

  // Load tables from localStorage per event, or initialize from guest table assignments
  useEffect(() => {
    const storageKey = `tangelo-tables-${activeEvent}`;
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setTables((prev) => ({ ...prev, [activeEvent]: JSON.parse(stored) }));
      } catch (e) {
        console.error("Failed to parse stored tables", e);
      }
    } else {
      // No stored tables: create default tables
      const defaultTables: TableDefinition[] = [
        { id: `table-1-${activeEvent}`, name: "Table 1", capacity: 10 },
        { id: `table-2-${activeEvent}`, name: "Table 2", capacity: 10 },
        { id: `table-3-${activeEvent}`, name: "Table 3", capacity: 10 },
      ];
      setTables((prev) => ({ ...prev, [activeEvent]: defaultTables }));
      localStorage.setItem(storageKey, JSON.stringify(defaultTables));
    }
  }, [activeEvent]);

  // Save tables to localStorage whenever they change
  useEffect(() => {
    if (tables[activeEvent]) {
      localStorage.setItem(
        `tangelo-tables-${activeEvent}`,
        JSON.stringify(tables[activeEvent])
      );
    }
  }, [tables, activeEvent]);

  const currentTables = tables[activeEvent] || [];

  const filteredGuests = useMemo(
    () => guests.filter((g) => g.event === activeEvent),
    [guests, activeEvent]
  );

  const handleAddGuest = async (formData: FormData) => {
    const tableId = formData.get("tableId") as string;
    const newGuest: Guest = {
      id: `g${guests.length + 1}`,
      name: formData.get("name") as string,
      rsvp_status:
        (formData.get("rsvp_status") as Guest["rsvp_status"]) || "Pending",
      dietary_restrictions: formData.get("dietary_restrictions") as string,
      tableId: tableId === "none" ? undefined : tableId,
      event: formData.get("event") as string,
    };
    setGuests((prev) => [...prev, newGuest]);
    toast({
      title: "Success",
      description: "Guest added to your list.",
    });
    return true;
  };

  const handleUpdateGuest = async (id: string, formData: FormData) => {
    const tableId = formData.get("tableId") as string;
    const updatedData = {
      name: formData.get("name") as string,
      rsvp_status: formData.get("rsvp_status") as Guest["rsvp_status"],
      dietary_restrictions: formData.get("dietary_restrictions") as string,
      tableId: tableId === "none" ? undefined : tableId,
    };
    setGuests((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updatedData } : g))
    );
    toast({ title: "Success", description: "Guest updated." });
    return true;
  };

  const handleDeleteGuest = async (guestId: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== guestId));
    toast({ title: "Success", description: "Guest deleted." });
  };

  const handleImportGuests = async (
    importedGuests: Omit<Guest, "id">[],
    event: string
  ) => {
    const newGuests = importedGuests.map((g, i) => ({
      ...g,
      id: `imported-${Date.now()}-${i}`,
      event,
    }));
    setGuests((prev) => [...prev, ...newGuests]);
    toast({
      title: "Import Successful",
      description: `${importedGuests.length} guests were imported for ${event}.`,
    });
  };

  const handleTablesChange = (newTables: TableDefinition[]) => {
    setTables((prev) => ({ ...prev, [activeEvent]: newTables }));
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Guest List & Seating"
        description="Organize your guest list, track RSVPs, and plan seating arrangements for each event."
        icon={ClipboardListIcon}
      />

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
            {/* Table Manager Toggle Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTableManager(!showTableManager)}
              >
                <TableIcon className="mr-2 h-4 w-4" />
                {showTableManager ? "Hide Tables" : "Manage Tables"}
              </Button>
            </div>

            {/* Conditionally show Table Manager */}
            {showTableManager && (
              <TableManager
                tables={tables[event] || []}
                onChange={handleTablesChange}
              />
            )}

            <GuestManagement
              guests={filteredGuests}
              tables={currentTables}
              onAddGuest={handleAddGuest}
              onUpdateGuest={handleUpdateGuest}
              onDeleteGuest={handleDeleteGuest}
              onImportGuests={(imported) => handleImportGuests(imported, event)}
              currentEvent={event}
            />

            <Card className="shadow-xl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <LayoutGridIcon className="mr-3 h-6 w-6 text-primary" />
                    <CardTitle className="font-headline">
                      Seating Arrangement for {event}
                    </CardTitle>
                  </div>
                  <Button
                    onClick={() => setShowSeatingChart((prev) => !prev)}
                    variant="outline"
                  >
                    {showSeatingChart ? "Hide Chart" : "Show Chart"}
                  </Button>
                </div>
                <CardDescription>
                  View tables and guest assignments. Tables in red are over
                  capacity.
                </CardDescription>
              </CardHeader>
              {showSeatingChart && (
                <CardContent>
                  <SeatingChartDisplay
                    guests={filteredGuests}
                    tables={currentTables}
                  />
                </CardContent>
              )}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
