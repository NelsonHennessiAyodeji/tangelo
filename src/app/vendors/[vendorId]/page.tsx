"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  StarIcon,
  MapPinIcon,
  BadgeCentIcon,
  PhoneIcon,
  Mail,
  Instagram,
  GlobeIcon,
  CalendarIcon,
  Users,
  CheckCircle,
  Heart,
  Share2,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useSelectedVendors } from "@/hooks/use-selected-vendors";
import { mockWeddingDetails, mockVendors } from "@/lib/mockData";
import type { Vendor } from "@/lib/types";

export default function VendorProfilePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addVendor, removeVendor, isVendorSelected } = useSelectedVendors();
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("Traditional Wedding");

  const events = mockWeddingDetails.events;
  const selectedVendorInfo = vendor ? isVendorSelected(vendor.id) : null;
  const isSelected = !!selectedVendorInfo;

  useEffect(() => {
    // Try to get vendor from localStorage first (set by card click)
    const savedVendor = localStorage.getItem("currentVendorProfile");

    if (savedVendor) {
      try {
        setVendor(JSON.parse(savedVendor));
      } catch (error) {
        console.error("Error parsing vendor from localStorage:", error);
      }
    } else {
      // Fallback to mock vendors if needed
      setVendor(mockVendors[0]);
    }

    setLoading(false);
  }, []);

  const handleSaveVendor = async () => {
    if (!vendor) return;

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
  };

  const handleRemoveVendor = async () => {
    if (!vendor) return;

    await removeVendor(vendor.id);
    toast({
      title: "Vendor Removed",
      description: `${vendor.name} has been removed from your list.`,
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${vendor?.name} - Wedding Vendor`,
        text: `Check out ${vendor?.name} for your wedding!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Vendor link copied to clipboard!",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-96 w-full bg-gray-200 rounded mb-6"></div>
          <div className="h-32 w-full bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Vendor Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The vendor profile you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link href="/vendors">Back to Vendors</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Vendors
      </Button>

      {/* Hero Section */}
      <Card className="mb-8 overflow-hidden shadow-xl">
        <div className="relative h-64 md:h-80 w-full">
          <Image
            src={vendor.imageUrl || `https://placehold.co/1200x400.png`}
            alt={vendor.name}
            layout="fill"
            objectFit="cover"
            className="bg-secondary"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex flex-wrap items-center justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-headline mb-2">
                  {vendor.name}
                </h1>
                <div className="flex items-center gap-4">
                  <Badge
                    variant="secondary"
                    className="text-lg px-3 py-1 bg-white/20 backdrop-blur-sm"
                  >
                    {vendor.category}
                  </Badge>
                  {vendor.rating && (
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="text-lg font-semibold">
                        {vendor.rating}/5
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4 md:mt-0">
                <Button variant="secondary" onClick={handleShare}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                {isSelected ? (
                  <Button variant="destructive" onClick={handleRemoveVendor}>
                    <Heart className="mr-2 h-4 w-4 fill-current" />
                    Remove
                  </Button>
                ) : (
                  <Button onClick={handleSaveVendor}>
                    <Heart className="mr-2 h-4 w-4" />
                    Save Vendor
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">
                About {vendor.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-foreground leading-relaxed">
                {vendor.description ||
                  `${
                    vendor.name
                  } is a professional ${vendor.category.toLowerCase()} based in ${
                    vendor.location
                  }. With years of experience in Nigerian weddings, they bring expertise and passion to every event.`}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-headline text-xl font-semibold">
                    Services Offered
                  </h3>
                  <ul className="space-y-2">
                    {[
                      "Full wedding coordination",
                      "Customized packages",
                      "On-site management",
                      "Setup and teardown",
                      "Equipment rental",
                      "Professional staff",
                    ].map((service, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        <span>{service}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-headline text-xl font-semibold">
                    Pricing
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Basic Package</span>
                        <Badge variant="outline">From ₦500,000</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Essential services for intimate weddings
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Premium Package</span>
                        <Badge variant="outline">From ₦1,200,000</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Full service for medium-sized weddings
                      </p>
                    </div>
                    <div className="p-4 bg-secondary/30 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Luxury Package</span>
                        <Badge variant="outline">From ₦2,500,000</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Comprehensive services for large weddings
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gallery Section */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Gallery</CardTitle>
              <CardDescription>Previous work and portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div
                    key={num}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={`https://placehold.co/400x400.png?text=${vendor.category}+${num}`}
                      alt={`${vendor.name} portfolio ${num}`}
                      layout="fill"
                      objectFit="cover"
                      className="hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Contact Card */}
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vendor.contact.phone && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <PhoneIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <a
                      href={`tel:${vendor.contact.phone}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {vendor.contact.phone}
                    </a>
                  </div>
                </div>
              )}

              {vendor.contact.email && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <a
                      href={`mailto:${vendor.contact.email}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {vendor.contact.email}
                    </a>
                  </div>
                </div>
              )}

              {vendor.contact.instagram && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <Instagram className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Instagram</p>
                    <a
                      href={`https://instagram.com/${vendor.contact.instagram.replace(
                        "@",
                        ""
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {vendor.contact.instagram}
                    </a>
                  </div>
                </div>
              )}

              {vendor.contact.website && (
                <div className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                  <GlobeIcon className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Website</p>
                    <a
                      href={`${
                        vendor.contact.website.startsWith("http")
                          ? ""
                          : "https://"
                      }${vendor.contact.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-primary transition-colors break-all"
                    >
                      {vendor.contact.website}
                    </a>
                  </div>
                </div>
              )}

              <Separator />

              {/* Save for Event Selector */}
              <div className="space-y-3">
                <h4 className="font-medium">Save for Event</h4>
                <div className="flex gap-2">
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                  >
                    {events.map((event) => (
                      <option key={event} value={event}>
                        {event}
                      </option>
                    ))}
                  </select>
                  {isSelected ? (
                    <Button variant="destructive" onClick={handleRemoveVendor}>
                      Remove
                    </Button>
                  ) : (
                    <Button onClick={handleSaveVendor}>Save</Button>
                  )}
                </div>
              </div>

              <Button className="w-full" size="lg" asChild>
                <a
                  href={`mailto:${
                    vendor.contact.email || "contact@example.com"
                  }?subject=Inquiry about ${
                    vendor.name
                  }&body=Hello, I would like to inquire about your services for my wedding.`}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Send Inquiry
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPinIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{vendor.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BadgeCentIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Price Range</p>
                  <p className="font-medium">{vendor.priceRange}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Booking Lead Time
                  </p>
                  <p className="font-medium">3-6 months recommended</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Team Size</p>
                  <p className="font-medium">5-10 professionals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Testimonials */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline text-xl">
                Client Testimonials
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm italic mb-2">
                  "Absolutely amazing service! Our wedding was perfect thanks to
                  their attention to detail."
                </p>
                <p className="text-xs text-muted-foreground">
                  - Chinedu & Ngozi, December 2023
                </p>
              </div>

              <div className="p-4 bg-secondary/30 rounded-lg">
                <div className="flex items-center mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className="h-4 w-4 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>
                <p className="text-sm italic mb-2">
                  "Professional, punctual, and delivered beyond our
                  expectations. Highly recommended!"
                </p>
                <p className="text-xs text-muted-foreground">
                  - Adeola & Femi, August 2023
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
