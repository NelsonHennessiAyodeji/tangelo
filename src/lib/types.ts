export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
  event: string; // Event this task belongs to
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  priceRange: string;
  location: string;
  imageUrl?: string;
  rating?: number;
  description?: string;
  contact: {
    phone?: string;
    email?: string;
    instagram?: string;
    website?: string;
  };
  dataAiHint?: string;
  // This will be added when a vendor is selected for a specific event
  event?: string;
}

export interface AIVendorSuggestion {
  vendorName: string;
  vendorType: string;
  description: string;
  website: string;
  imageUrl: string;
}

export interface Expense {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: Date;
  event: string; // Event this expense belongs to
}

export interface Guest {
  id: string;
  name: string;
  rsvp_status: "Pending" | "Accepted" | "Declined";
  dietary_restrictions?: string;
  tableId?: string; // Now references a table by ID
  event: string; // Event this guest is invited to
}

export interface Notification {
  id: string;
  message: string;
  date: Date;
  read: boolean;
  type: "alert" | "info" | "success";
}

export interface NavItemType {
  href: string;
  label: string;
  icon?: React.ElementType;
}

export interface WeddingTable {
  id: string;
  name: string;
  capacity: number;
  assignedGuests: Guest[];
  position?: { x: number; y: number }; // Added for floorplan
}

export interface VendorService {
  name: string;
  description: string;
  price: string;
}

export interface VendorTestimonial {
  name: string;
  date: string;
  rating: number;
  comment: string;
}

export interface VendorProfile extends Vendor {
  services: VendorService[];
  testimonials: VendorTestimonial[];
  teamSize?: number;
  leadTime?: string;
  portfolioImages?: string[];
}

// Represents a non-table item on the floorplan like the dance floor or bar.
export interface FloorplanItem {
  id: string;
  type:
    | "dance-floor"
    | "dj-booth"
    | "bar"
    | "cake-table"
    | "entrance"
    | "gift-table"
    | "photo-booth"
    | "bridal-table"
    | "vendor-spot";
  label: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  vendorId?: string; // Optional: link to a specific vendor
}

export interface WeddingEvent {
  name: string;
  date: Date;
}

export type WeddingDateType = Date | Date[];

// Simplified from the original Supabase-joined type
export interface Wedding {
  id: string;
  location: string;
  wedding_date: string; // ISO string
  events: string[];
  budget?: number;
  user?: {
    first_name?: string;
    last_name?: string;
  };
  partner?: {
    first_name?: string;
    last_name?: string;
  } | null;
}

// Kept for legacy compatibility if needed by any component
export interface WeddingDetails {
  couple: {
    user: {
      firstName: string;
      lastName: string;
      role: "bride" | "groom" | "planner";
    };
    partner: {
      firstName: string;
      lastName: string;
    };
  };
  events: string[];
  location: string;
  guestCount?: string; // Add guest count here
}
