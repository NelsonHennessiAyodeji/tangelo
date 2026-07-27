"use client";

import { useState } from "react";
import Image from "next/image";
import type { Vendor } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  StarIcon,
  MapPinIcon,
  BadgeCentIcon,
  PhoneIcon,
  Heart,
  Mail,
  Instagram,
  PartyPopper,
  GlobeIcon,
  ExternalLink,
} from "lucide-react";
import { useSelectedVendors } from "@/hooks/use-selected-vendors";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/hooks/use-auth";
import { mockWeddingDetails } from "@/lib/mockData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface VendorCardProps {
  vendor: Vendor;
}

export default function VendorCard({ vendor }: VendorCardProps) {
  const router = useRouter();
  const { addVendor, removeVendor, isVendorSelected } = useSelectedVendors();
  const { toast } = useToast();
  const { user } = useAuth();

  const selectedVendorInfo = isVendorSelected(vendor.id);
  const isSelected = !!selectedVendorInfo;
  const events = mockWeddingDetails.events;
  const [selectedEvent, setSelectedEvent] = useState(
    selectedVendorInfo?.event || events[0]
  );

  const handleSelectClick = async () => {
    if (!user) {
      toast({
        title: "Please Log In",
        description: "You need to be logged in to save vendors.",
        variant: "destructive",
      });
      return;
    }

    if (isSelected) {
      // If it's already selected, the button acts as a removal button.
      await removeVendor(vendor.id);
      toast({
        title: "Vendor Removed",
        description: `${vendor.name} has been removed from your list.`,
      });
    } else {
      // If it's not selected, we add it with the chosen event.
      const vendorWithEvent = { ...vendor, event: selectedEvent };
      const wasAdded = await addVendor(vendorWithEvent);
      if (wasAdded) {
        toast({
          title: "Vendor Saved!",
          description: `${vendor.name} has been added to 'My Vendors' for ${selectedEvent}.`,
        });
      } else {
        toast({
          title: "Already Saved",
          description: `${vendor.name} is already in your list.`,
        });
      }
    }
  };

  const handleCardClick = () => {
    // Save vendor data to localStorage for the profile page
    localStorage.setItem("currentVendorProfile", JSON.stringify(vendor));
    router.push(`/vendors/${vendor.id}`);
  };

  return (
    <Card
      className="flex flex-col overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative w-full h-48">
        <Image
          src={vendor.imageUrl || `https://placehold.co/600x400.png`}
          alt={vendor.name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={vendor.dataAiHint || "event service"}
          className="bg-secondary"
        />
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
          <ExternalLink className="h-3 w-3" /> View Profile
        </div>
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
          {vendor.name}
        </CardTitle>
        <CardDescription className="text-sm text-primary">
          {vendor.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow space-y-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPinIcon className="h-4 w-4 mr-2 text-accent" />
          {vendor.location}
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BadgeCentIcon className="h-4 w-4 mr-2 text-accent" />
          Price Guide: {vendor.priceRange}
        </div>
        {vendor.rating && (
          <div className="flex items-center text-sm text-muted-foreground">
            <StarIcon className="h-4 w-4 mr-2 text-yellow-500 fill-yellow-500" />
            {vendor.rating}/5 stars
          </div>
        )}
        {vendor.description && (
          <p className="text-sm text-foreground leading-relaxed line-clamp-2">
            {vendor.description}
          </p>
        )}
      </CardContent>
      <CardFooter
        className="flex flex-col items-stretch gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {isSelected ? (
          <div className="flex items-center justify-center text-sm font-semibold p-2 bg-green-100 text-green-800 rounded-md">
            <PartyPopper className="h-4 w-4 mr-2" />
            Saved for {selectedVendorInfo?.event}
          </div>
        ) : (
          <Select value={selectedEvent} onValueChange={setSelectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Select event to save for..." />
            </SelectTrigger>
            <SelectContent>
              {events.map((e) => (
                <SelectItem key={e} value={e}>
                  Save for {e}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <PhoneIcon className="mr-2 h-4 w-4" />
                Contact
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-3">
                <h4 className="font-medium leading-none text-foreground">
                  Contact Information
                </h4>
                <div className="grid gap-2">
                  {vendor.contact.phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`tel:${vendor.contact.phone}`}
                        className="hover:underline text-primary"
                      >
                        {vendor.contact.phone}
                      </a>
                    </div>
                  )}
                  {vendor.contact.email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`mailto:${vendor.contact.email}`}
                        className="hover:underline text-primary"
                      >
                        {vendor.contact.email}
                      </a>
                    </div>
                  )}
                  {vendor.contact.instagram && (
                    <div className="flex items-center gap-3 text-sm">
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`https://instagram.com/${vendor.contact.instagram.replace(
                          "@",
                          ""
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-primary"
                      >
                        {vendor.contact.instagram}
                      </a>
                    </div>
                  )}
                  {vendor.contact.website && (
                    <div className="flex items-center gap-3 text-sm">
                      <GlobeIcon className="h-4 w-4 text-muted-foreground" />
                      <a
                        href={`${
                          vendor.contact.website.startsWith("http")
                            ? ""
                            : "https://"
                        }${vendor.contact.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-primary"
                      >
                        {vendor.contact.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            variant={isSelected ? "destructive" : "secondary"}
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectClick();
            }}
            disabled={!selectedEvent && !isSelected}
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isSelected ? "fill-current" : ""}`}
            />
            {isSelected ? "Remove" : "Save"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
