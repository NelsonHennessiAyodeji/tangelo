"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon, FilterIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface VendorFiltersProps {
  categories: string[];
  locations: string[];
  onFilterChange: (filters: {
    category: string;
    location: string;
    search: string;
  }) => void;
}

export default function VendorFilters({
  categories,
  locations,
  onFilterChange,
}: VendorFiltersProps) {
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category: category === "all" ? "" : category,
      location: location === "all" ? "" : location,
      search: searchQuery.trim(),
    });
  };

  const handleReset = () => {
    setCategory("all");
    setLocation("all");
    setSearchQuery("");
    onFilterChange({ category: "", location: "", search: "" });
  };

  return (
    <Card className="mb-8 shadow-md">
      <CardHeader>
        <CardTitle className="font-headline flex items-center">
          <SearchIcon className="mr-2 h-5 w-5 text-primary" />
          Find Vendors
        </CardTitle>
        <CardDescription>
          Search and filter vendors by name, category, or location.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFilter} className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vendors by name, category, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <FilterIcon className="h-3 w-3 mr-1" /> Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block flex items-center">
                <FilterIcon className="h-3 w-3 mr-1" /> Location
              </label>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="All Locations" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((loc) => (
                    <SelectItem key={loc} value={loc}>
                      {loc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button type="submit" className="flex-1">
              <SearchIcon className="mr-2 h-4 w-4" />
              Search & Filter
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="flex-1"
            >
              <XIcon className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
