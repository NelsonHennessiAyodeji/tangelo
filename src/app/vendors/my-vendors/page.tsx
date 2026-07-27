"use client";

import { useMemo, useState } from "react";
import PageHeader from "@/components/PageHeader";
import VendorList from "@/components/vendors/VendorList";
import { useSelectedVendors } from "@/hooks/use-selected-vendors";
import { Heart, Building2, PlusCircle, SearchIcon, XIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { mockWeddingDetails } from "@/lib/mockData";
import AddVendorDialog from "@/components/vendors/AddVendorDialog";
import type { Vendor } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function MyVendorsPage() {
  const { selectedVendors, isLoaded, addVendor } = useSelectedVendors();
  const events = mockWeddingDetails.events;

  // Search and filter states for My Vendors
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("all");

  const vendorsByEvent = useMemo(() => {
    const grouped: Record<string, Vendor[]> = {};
    events.forEach((event) => {
      grouped[event] = selectedVendors.filter(
        (vendor) => vendor.event === event
      );
    });
    return grouped;
  }, [selectedVendors, events]);

  // Filter vendors based on search and event filter
  const filteredVendors = useMemo(() => {
    let filtered = selectedVendors;

    // Filter by event
    if (selectedEvent !== "all") {
      filtered = filtered.filter((vendor) => vendor.event === selectedEvent);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (vendor) =>
          vendor.name.toLowerCase().includes(searchLower) ||
          vendor.category.toLowerCase().includes(searchLower) ||
          vendor.description?.toLowerCase().includes(searchLower) ||
          vendor.location.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }, [selectedVendors, selectedEvent, searchTerm]);

  const handleAddCustomVendor = async (vendorData: Omit<Vendor, "id">) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `custom-${Date.now()}`, // Create a unique ID for the custom vendor
    };
    await addVendor(newVendor);
    // Reset search and filters after adding new vendor
    setSearchTerm("");
    setSelectedEvent("all");
  };

  const renderContent = () => {
    if (!isLoaded) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <Skeleton className="h-48 w-full" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center pt-4">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      );
    }

    if (selectedVendors.length === 0) {
      return (
        <div className="text-center py-16 bg-secondary/30 rounded-lg">
          <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">
            You haven't saved any vendors yet.
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Use the AI Concierge to find vendors or add your own.
          </p>
          <Button asChild className="mt-4">
            <Link href="/vendors">Find Vendors</Link>
          </Button>
        </div>
      );
    }

    if (filteredVendors.length === 0) {
      return (
        <div className="text-center py-12 bg-secondary/30 rounded-lg">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">
              No saved vendors match your search
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or event filter.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("");
                setSelectedEvent("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {/* My Vendors Search & Filter Bar */}
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-muted-foreground" />
                </div>
                <Input
                  type="search"
                  placeholder="Search your saved vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-primary"
                  >
                    <XIcon className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="w-full md:w-48">
                <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Events" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    {events.map((event) => (
                      <SelectItem key={event} value={event}>
                        {event}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm || selectedEvent !== "all") && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedEvent("all");
                    }}
                    className="h-10"
                  >
                    <XIcon className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                </div>
              )}
            </div>

            {(searchTerm || selectedEvent !== "all") && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchTerm && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Search: "{searchTerm}"
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-destructive"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                {selectedEvent !== "all" && (
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    Event: {selectedEvent}
                    <button
                      onClick={() => setSelectedEvent("all")}
                      className="ml-1 hover:text-destructive"
                    >
                      <XIcon className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                <div className="text-sm text-muted-foreground ml-auto">
                  Showing {filteredVendors.length} of {selectedVendors.length}{" "}
                  saved vendors
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Group vendors by event if no event filter is selected */}
        {selectedEvent === "all" ? (
          <div className="space-y-8">
            {events.map(
              (event) =>
                vendorsByEvent[event] &&
                vendorsByEvent[event].length > 0 && (
                  <div key={event}>
                    <h2 className="text-2xl font-headline text-primary flex items-center mb-4">
                      <Building2 className="mr-3 h-6 w-6" />
                      Vendors for {event}
                      <Badge variant="outline" className="ml-2">
                        {vendorsByEvent[event].length}
                      </Badge>
                    </h2>
                    <VendorList vendors={vendorsByEvent[event]} />
                  </div>
                )
            )}
          </div>
        ) : (
          // Show filtered vendors without grouping when event filter is applied
          <div>
            <h2 className="text-2xl font-headline text-primary flex items-center mb-4">
              <Building2 className="mr-3 h-6 w-6" />
              Vendors for {selectedEvent}
              <Badge variant="outline" className="ml-2">
                {filteredVendors.length}
              </Badge>
            </h2>
            <VendorList vendors={filteredVendors} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Saved Vendors"
        description="Manage and search through your saved vendors, organized by event."
        icon={Heart}
      >
        <AddVendorDialog onSave={handleAddCustomVendor} events={events}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Custom Vendor
          </Button>
        </AddVendorDialog>
      </PageHeader>
      {renderContent()}
    </div>
  );
}
