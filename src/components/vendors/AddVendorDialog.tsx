"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  X,
  Upload,
  DollarSign,
  Clock,
  Award,
  CheckCircle,
  Image as ImageIcon,
} from "lucide-react";
import type { Vendor } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface AddVendorDialogProps {
  children: React.ReactNode;
  events: string[];
  onSave: (vendor: Omit<Vendor, "id">) => Promise<void>;
}

interface Service {
  name: string;
  price: string;
  description: string;
}

interface GalleryImage {
  url: string;
  caption: string;
}

const initialFormState: Omit<Vendor, "id"> & {
  services: Service[];
  galleryImages: GalleryImage[];
  availability: {
    currentMonth: string;
    nextMonth: string;
    leadTime: string;
  };
  quickFacts: {
    responseTime: string;
    experience: string;
    weddingsServed: string;
  };
} = {
  name: "",
  category: "",
  priceRange: "Mid-Range",
  location: "Lagos, NG",
  description: "",
  rating: 4.5,
  imageUrl: "",
  contact: {
    phone: "",
    email: "",
    instagram: "",
    website: "",
  },
  event: "",
  dataAiHint: "",
  // Additional fields for vendor profile
  services: [
    {
      name: "Basic Package",
      price: "₦500,000",
      description: "Standard service package",
    },
    {
      name: "Premium Package",
      price: "₦1,200,000",
      description: "Full service with extras",
    },
    {
      name: "Custom Package",
      price: "Contact for quote",
      description: "Tailored to your needs",
    },
  ],
  galleryImages: [
    { url: "", caption: "Main Image" },
    { url: "", caption: "Gallery Image 2" },
    { url: "", caption: "Gallery Image 3" },
    { url: "", caption: "Gallery Image 4" },
  ],
  availability: {
    currentMonth: "Available",
    nextMonth: "Limited",
    leadTime: "2-4 weeks",
  },
  quickFacts: {
    responseTime: "Within 24 hours",
    experience: "5+ years in business",
    weddingsServed: "100+ weddings served",
  },
};

export default function AddVendorDialog({
  children,
  events,
  onSave,
}: AddVendorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState(initialFormState);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const priceRanges = [
    "Budget",
    "Mid-Range",
    "Premium",
    "Luxury",
    "Very Luxury",
  ];
  const categories = [
    "Photographer",
    "Caterer",
    "Venue",
    "Makeup Artist",
    "Videographer",
    "Decorator",
    "DJ/Live Band",
    "MC",
    "Cake Designer",
    "Aso Ebi Supplier",
    "Wedding Planner",
    "Transportation",
    "Sound System",
    "Lighting",
    "Florist",
  ];
  const locations = [
    "Lagos, NG",
    "Abuja, NG",
    "Port Harcourt, NG",
    "Ibadan, NG",
    "Other",
  ];

  const handleFieldChange = (
    field: keyof typeof formData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (
    field: keyof typeof formData.contact,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value,
      },
    }));
  };

  const handleServiceChange = (
    index: number,
    field: keyof Service,
    value: string
  ) => {
    const newServices = [...formData.services];
    newServices[index] = { ...newServices[index], [field]: value };
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const handleGalleryChange = (
    index: number,
    field: keyof GalleryImage,
    value: string
  ) => {
    const newImages = [...formData.galleryImages];
    newImages[index] = { ...newImages[index], [field]: value };
    setFormData((prev) => ({ ...prev, galleryImages: newImages }));
  };

  const handleAvailabilityChange = (
    field: keyof typeof formData.availability,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value,
      },
    }));
  };

  const handleQuickFactsChange = (
    field: keyof typeof formData.quickFacts,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      quickFacts: {
        ...prev.quickFacts,
        [field]: value,
      },
    }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      services: [...prev.services, { name: "", price: "", description: "" }],
    }));
  };

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, services: newServices }));
  };

  const addGalleryImage = () => {
    setFormData((prev) => ({
      ...prev,
      galleryImages: [
        ...prev.galleryImages,
        { url: "", caption: `Gallery Image ${prev.galleryImages.length + 1}` },
      ],
    }));
  };

  const removeGalleryImage = (index: number) => {
    const newImages = formData.galleryImages.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, galleryImages: newImages }));
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (index !== undefined) {
          handleGalleryChange(index, "url", result);
        } else {
          handleFieldChange("imageUrl", result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.event) {
      toast({
        title: "Missing Information",
        description: "Please fill out the Name, Category, and Event fields.",
        variant: "destructive",
      });
      return;
    }

    // Prepare vendor data for saving
    const vendorData: Omit<Vendor, "id"> = {
      name: formData.name,
      category: formData.category,
      priceRange: formData.priceRange,
      location: formData.location,
      description: formData.description,
      rating: formData.rating,
      imageUrl:
        formData.imageUrl ||
        `https://placehold.co/600x400.png?text=${encodeURIComponent(
          formData.name
        )}`,
      contact: formData.contact,
      event: formData.event,
      dataAiHint:
        formData.dataAiHint || `${formData.category.toLowerCase()} service`,
    };

    // Save additional data to localStorage
    const vendorProfileData = {
      ...vendorData,
      services: formData.services,
      galleryImages: formData.galleryImages.map((img, idx) => ({
        url:
          img.url ||
          `https://placehold.co/600x400/FFE4E1/FF6B6B?text=${encodeURIComponent(
            formData.name
          )}+${idx + 1}`,
        caption: img.caption,
      })),
      availability: formData.availability,
      quickFacts: formData.quickFacts,
    };

    // Store in localStorage for the vendor profile page
    if (typeof window !== "undefined") {
      try {
        const vendorId = `custom-${Date.now()}`;
        const existingVendors = JSON.parse(
          localStorage.getItem("tangelo-vendors") || "[]"
        );
        const updatedVendors = [
          ...existingVendors,
          { ...vendorProfileData, id: vendorId },
        ];
        localStorage.setItem("tangelo-vendors", JSON.stringify(updatedVendors));
      } catch (error) {
        console.error("Error saving vendor profile data:", error);
      }
    }

    await onSave(vendorData);
    toast({
      title: "Vendor Added",
      description: `${formData.name} has been added to your saved vendors.`,
    });
    setFormData(initialFormState);
    setIsOpen(false);
    setActiveTab("basic");
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setActiveTab("basic");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetForm();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">
            Add Custom Vendor
          </DialogTitle>
          <DialogDescription>
            Add complete details for a vendor that isn't on our marketplace. All
            information will be available on their profile page.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="media">Media & Gallery</TabsTrigger>
            <TabsTrigger value="services">Services & Pricing</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit}>
            <TabsContent value="basic" className="space-y-4 pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vendor Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleFieldChange("name", e.target.value)}
                    placeholder="e.g., Jide Ojo Photography"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      handleFieldChange("category", value)
                    }
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="event">Event *</Label>
                  <Select
                    value={formData.event}
                    onValueChange={(value) => handleFieldChange("event", value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select event" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event} value={event}>
                          {event}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priceRange">Price Range</Label>
                  <Select
                    value={formData.priceRange}
                    onValueChange={(value) =>
                      handleFieldChange("priceRange", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select price range" />
                    </SelectTrigger>
                    <SelectContent>
                      {priceRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select
                    value={formData.location}
                    onValueChange={(value) =>
                      handleFieldChange("location", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc} value={loc}>
                          {loc}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="rating"
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) =>
                        handleFieldChange("rating", parseFloat(e.target.value))
                      }
                      className="w-full"
                    />
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          filled={star <= Math.round(formData.rating || 0)}
                          className="h-5 w-5 text-yellow-500"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleFieldChange("description", e.target.value)
                  }
                  placeholder="Describe the vendor's services, experience, and specialties..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataAiHint">AI Search Hint</Label>
                <Input
                  id="dataAiHint"
                  value={formData.dataAiHint}
                  onChange={(e) =>
                    handleFieldChange("dataAiHint", e.target.value)
                  }
                  placeholder="e.g., wedding photography, food catering"
                />
              </div>
            </TabsContent>

            <TabsContent value="media" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div>
                  <Label className="mb-2 block">Main Profile Image</Label>
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center",
                        formData.imageUrl ? "border-primary" : "border-muted"
                      )}
                    >
                      {formData.imageUrl ? (
                        <div className="relative w-full h-full">
                          <img
                            src={formData.imageUrl}
                            alt="Main profile"
                            className="w-full h-full object-cover rounded-lg"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6"
                            onClick={() => handleFieldChange("imageUrl", "")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Image
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Recommended: 600x400px or similar aspect ratio
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e)}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <Label>Gallery Images</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addGalleryImage}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Image
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.galleryImages.map((image, index) => (
                      <div key={index} className="space-y-2">
                        <Label htmlFor={`gallery-${index}`}>
                          Image {index + 1}
                        </Label>
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              "flex-1 h-24 border-2 border-dashed rounded-lg flex items-center justify-center",
                              image.url ? "border-primary" : "border-muted"
                            )}
                          >
                            {image.url ? (
                              <div className="relative w-full h-full">
                                <img
                                  src={image.url}
                                  alt={`Gallery ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                              </div>
                            ) : (
                              <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              document
                                .getElementById(`gallery-upload-${index}`)
                                ?.click()
                            }
                          >
                            <Upload className="h-4 w-4" />
                          </Button>
                          <input
                            id={`gallery-upload-${index}`}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, index)}
                          />
                          {formData.galleryImages.length > 1 && (
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={() => removeGalleryImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <Input
                          id={`gallery-caption-${index}`}
                          value={image.caption}
                          onChange={(e) =>
                            handleGalleryChange(
                              index,
                              "caption",
                              e.target.value
                            )
                          }
                          placeholder="Caption for this image"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="services" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Services & Pricing Packages</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addService}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service
                  </Button>
                </div>

                {formData.services.map((service, index) => (
                  <Card key={index} className="border-primary/20">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">
                          Package {index + 1}
                        </CardTitle>
                        {formData.services.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeService(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`service-name-${index}`}>
                            Package Name
                          </Label>
                          <Input
                            id={`service-name-${index}`}
                            value={service.name}
                            onChange={(e) =>
                              handleServiceChange(index, "name", e.target.value)
                            }
                            placeholder="e.g., Basic Package"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`service-price-${index}`}>
                            Price
                          </Label>
                          <Input
                            id={`service-price-${index}`}
                            value={service.price}
                            onChange={(e) =>
                              handleServiceChange(
                                index,
                                "price",
                                e.target.value
                              )
                            }
                            placeholder="e.g., ₦500,000"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`service-desc-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`service-desc-${index}`}
                          value={service.description}
                          onChange={(e) =>
                            handleServiceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Describe what's included in this package..."
                          rows={2}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 pt-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Award className="mr-2 h-5 w-5" />
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.contact.phone}
                        onChange={(e) =>
                          handleContactChange("phone", e.target.value)
                        }
                        placeholder="+2348012345678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.contact.email}
                        onChange={(e) =>
                          handleContactChange("email", e.target.value)
                        }
                        placeholder="contact@vendor.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="instagram">Instagram Handle</Label>
                      <Input
                        id="instagram"
                        value={formData.contact.instagram}
                        onChange={(e) =>
                          handleContactChange("instagram", e.target.value)
                        }
                        placeholder="@vendorhandle"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={formData.contact.website}
                        onChange={(e) =>
                          handleContactChange("website", e.target.value)
                        }
                        placeholder="https://vendor.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Availability
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentMonth">Current Month</Label>
                      <Select
                        value={formData.availability.currentMonth}
                        onValueChange={(value) =>
                          handleAvailabilityChange("currentMonth", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="Booked">Fully Booked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nextMonth">Next Month</Label>
                      <Select
                        value={formData.availability.nextMonth}
                        onValueChange={(value) =>
                          handleAvailabilityChange("nextMonth", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Limited">Limited</SelectItem>
                          <SelectItem value="Booked">Fully Booked</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadTime">Lead Time</Label>
                      <Select
                        value={formData.availability.leadTime}
                        onValueChange={(value) =>
                          handleAvailabilityChange("leadTime", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2-4 weeks">2-4 weeks</SelectItem>
                          <SelectItem value="1-2 months">1-2 months</SelectItem>
                          <SelectItem value="3+ months">3+ months</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Quick Facts
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="responseTime">Response Time</Label>
                      <Select
                        value={formData.quickFacts.responseTime}
                        onValueChange={(value) =>
                          handleQuickFactsChange("responseTime", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Within 24 hours">
                            Within 24 hours
                          </SelectItem>
                          <SelectItem value="Within 48 hours">
                            Within 48 hours
                          </SelectItem>
                          <SelectItem value="Within a week">
                            Within a week
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">Experience</Label>
                      <Select
                        value={formData.quickFacts.experience}
                        onValueChange={(value) =>
                          handleQuickFactsChange("experience", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 years in business">
                            1-2 years in business
                          </SelectItem>
                          <SelectItem value="3-5 years in business">
                            3-5 years in business
                          </SelectItem>
                          <SelectItem value="5+ years in business">
                            5+ years in business
                          </SelectItem>
                          <SelectItem value="10+ years in business">
                            10+ years in business
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weddingsServed">Weddings Served</Label>
                      <Select
                        value={formData.quickFacts.weddingsServed}
                        onValueChange={(value) =>
                          handleQuickFactsChange("weddingsServed", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-50 weddings served">
                            0-50 weddings
                          </SelectItem>
                          <SelectItem value="50+ weddings served">
                            50+ weddings
                          </SelectItem>
                          <SelectItem value="100+ weddings served">
                            100+ weddings
                          </SelectItem>
                          <SelectItem value="200+ weddings served">
                            200+ weddings
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <DialogFooter className="mt-6">
              <div className="flex justify-between w-full">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setActiveTab(
                        activeTab === "basic"
                          ? "details"
                          : activeTab === "details"
                          ? "services"
                          : activeTab === "services"
                          ? "media"
                          : "basic"
                      )
                    }
                    disabled={activeTab === "basic"}
                  >
                    Previous
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setActiveTab(
                        activeTab === "basic"
                          ? "media"
                          : activeTab === "media"
                          ? "services"
                          : activeTab === "services"
                          ? "details"
                          : "details"
                      )
                    }
                    disabled={activeTab === "details"}
                  >
                    Next
                  </Button>
                </div>
                <div className="flex gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit">Save Vendor</Button>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

// Helper component for star rating display
const StarIcon = ({
  filled,
  className,
}: {
  filled: boolean;
  className: string;
}) => (
  <svg
    className={className}
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);
