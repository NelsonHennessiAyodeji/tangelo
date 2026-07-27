"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import VendorList from "@/components/vendors/VendorList";
import VendorFilters from "@/components/vendors/VendorFilters";
import { StoreIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { mockVendors } from "@/lib/mockData";
import type { Vendor } from "@/lib/types";

export default function VendorsPage() {
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(mockVendors);

  const uniqueCategories = useMemo(
    () => Array.from(new Set(mockVendors.map((v) => v.category))),
    []
  );
  const uniqueLocations = useMemo(
    () => Array.from(new Set(mockVendors.map((v) => v.location))),
    []
  );

  const handleFilterChange = (filters: {
    category: string;
    location: string;
    search: string;
  }) => {
    let vendors = mockVendors;

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      vendors = vendors.filter(
        (v) =>
          v.name.toLowerCase().includes(searchLower) ||
          v.category.toLowerCase().includes(searchLower) ||
          (v.description &&
            v.description.toLowerCase().includes(searchLower)) ||
          v.location.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (filters.category) {
      vendors = vendors.filter((v) => v.category === filters.category);
    }

    // Location filter
    if (filters.location) {
      vendors = vendors.filter((v) => v.location === filters.location);
    }

    setFilteredVendors(vendors);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Vendor Marketplace"
        description="Discover and connect with top Nigerian wedding vendors."
        icon={StoreIcon}
      >
        <Button asChild variant="outline">
          <Link href="/vendors/my-vendors">
            <Heart className="mr-2 h-4 w-4" /> My Saved Vendors
          </Link>
        </Button>
      </PageHeader>

      <VendorFilters
        categories={uniqueCategories}
        locations={uniqueLocations}
        onFilterChange={handleFilterChange}
      />

      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          Showing {filteredVendors.length} vendor
          {filteredVendors.length !== 1 ? "s" : ""}
        </p>
        {filteredVendors.length !== mockVendors.length && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              handleFilterChange({ category: "", location: "", search: "" })
            }
          >
            Show All Vendors
          </Button>
        )}
      </div>

      <VendorList vendors={filteredVendors} />
    </div>
  );
}
