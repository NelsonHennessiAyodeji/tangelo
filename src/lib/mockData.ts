import type {
  Task,
  Vendor,
  Guest,
  Expense,
  WeddingDetails,
  WeddingEvent,
} from "./types";

// Mock data is being restored for demonstration purposes, as requested.
// In a real application, this data would come from a database.

export const mockWeddingDetails: WeddingDetails = {
  couple: {
    user: {
      firstName: "Tunde",
      lastName: "Adebayo",
      role: "groom",
    },
    partner: {
      firstName: "Adanna",
      lastName: "Okoro",
    },
  },
  events: ["Traditional Wedding", "White Wedding Reception"],
  location: "Lagos, Nigeria",
  guestCount: "100-300", // Default guest count
};

// Use this for the multi-event countdown
export const mockEventDates: WeddingEvent[] = [
  { name: "Traditional Wedding", date: new Date("2025-09-18T12:00:00") },
  { name: "White Wedding Reception", date: new Date("2025-09-20T15:00:00") },
];

// Kept for single-date components that might still use it
export const weddingDate = new Date("2025-09-20T15:00:00");

export const mockTasks: Task[] = [
  {
    id: "1",
    name: "Set Wedding Date",
    description: "Finalize and announce the wedding date.",
    completed: true,
    dueDate: new Date("2024-11-15"),
    event: "Traditional Wedding",
  },
  {
    id: "2",
    name: "Create Budget",
    description: "Outline all expected expenses.",
    completed: true,
    dueDate: new Date("2024-11-20"),
    event: "Traditional Wedding",
  },
  {
    id: "3",
    name: "Book Venue (e.g., Event Hall)",
    description: "Secure the location for the ceremony and reception.",
    completed: false,
    dueDate: new Date("2025-01-10"),
    event: "White Wedding Reception",
  },
  {
    id: "4",
    name: "Hire Photographer/Videographer",
    description: "Book professionals to capture the day.",
    completed: true,
    dueDate: new Date("2025-02-01"),
    event: "Traditional Wedding",
  },
  {
    id: "5",
    name: "Send Out Invitations",
    description: "Mail or digitally send invitations to all guests.",
    completed: false,
    dueDate: new Date("2025-04-15"),
    event: "White Wedding Reception",
  },
  {
    id: "6",
    name: "Finalize Guest List & Seating Arrangement",
    description: "Confirm attendees and plan table seatings.",
    completed: false,
    dueDate: new Date("2025-08-01"),
    event: "White Wedding Reception",
  },
  {
    id: "7",
    name: "Arrange Aso Ebi",
    description: "Coordinate traditional attire for family/friends.",
    completed: false,
    dueDate: new Date("2025-03-15"),
    event: "Traditional Wedding",
  },
  {
    id: "8",
    name: "Food Tasting with Caterer",
    description: "Select menu items for the reception.",
    completed: false,
    dueDate: new Date("2025-05-10"),
    event: "White Wedding Reception",
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "v1",
    name: "Jide Ojo Photography",
    category: "Photographer",
    priceRange: "Premium",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.8,
    description:
      "Capturing timeless moments with a creative and modern touch. Specializes in traditional and white weddings.",
    contact: {
      phone: "+2348012345678",
      email: "jide@ojophoto.com",
      instagram: "@jideojo",
      website: "jidephotography.com",
    },
    dataAiHint: "wedding photography",
  },
  {
    id: "v2",
    name: "Abike's Cuisine",
    category: "Caterer",
    priceRange: "Mid-Range",
    location: "Abuja, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.9,
    description:
      "Authentic Nigerian dishes and continental cuisine to delight your guests. From Jollof rice to small chops.",
    contact: {
      phone: "+2348022345679",
      email: "contact@abikescuisine.com",
      instagram: "@abikescuisine",
      website: "abikescuisine.com",
    },
    dataAiHint: "food catering",
  },
  {
    id: "v3",
    name: "The Luxe Event Hall",
    category: "Venue",
    priceRange: "Luxury",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.7,
    description:
      "A luxurious and spacious venue perfect for grand receptions. Fully air-conditioned with ample parking space.",
    contact: {
      phone: "+2348033456780",
      email: "bookings@luxehall.ng",
      instagram: "@theluxehall",
      website: "theluxeeventhall.com",
    },
    dataAiHint: "event venue",
  },
  {
    id: "v4",
    name: "Gele by Tolu",
    category: "Makeup Artist",
    priceRange: "Premium",
    location: "Port Harcourt, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 5.0,
    description:
      "Expert bridal makeup and Gele tying services to make you look stunning on your big day.",
    contact: {
      phone: "+2348044567891",
      email: "bookings@gelebytolu.com",
      instagram: "@gelebytolu",
      website: "gelebytolu.com",
    },
    dataAiHint: "bridal makeup",
  },
  {
    id: "v5",
    name: "Visionary Films",
    category: "Videographer",
    priceRange: "Premium",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.9,
    description:
      "Cinematic wedding films that tell your unique love story. Using the latest 4K camera technology.",
    contact: {
      phone: "+2348055678902",
      email: "hello@visionaryfilms.ng",
      instagram: "@visionaryfilms",
      website: "visionaryfilms.ng",
    },
    dataAiHint: "wedding videography",
  },
  {
    id: "v6",
    name: "Enchanted Events Decor",
    category: "Decorator",
    priceRange: "Luxury",
    location: "Abuja, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.8,
    description:
      "Transforming venues into dreamscapes with bespoke decoration themes, from floral to contemporary.",
    contact: {
      phone: "+2348066789013",
      email: "info@enchantedevents.ng",
      instagram: "@enchanteddecore",
      website: "enchantedevents.ng",
    },
    dataAiHint: "event decoration",
  },
  {
    id: "v7",
    name: "DJ Spin-All",
    category: "DJ/Live Band",
    priceRange: "Mid-Range",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.7,
    description:
      "Keeping the dance floor alive with a mix of Afrobeats, Highlife, and international hits.",
    contact: {
      phone: "+2348077890124",
      email: "bookings@djspinall.com",
      instagram: "@djspinall",
      website: "djspinall.com",
    },
    dataAiHint: "dj music",
  },
  {
    id: "v8",
    name: "MC Funke",
    category: "MC",
    priceRange: "Premium",
    location: "Ibadan, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.9,
    description:
      "An engaging and professional Master of Ceremonies who brings class and fun to your reception.",
    contact: {
      phone: "+2348088901235",
      email: "funke@mcfunke.com",
      instagram: "@mcfunke",
      website: "mcfunke.com",
    },
    dataAiHint: "event host",
  },
  {
    id: "v9",
    name: "Cakes by Tobi",
    category: "Cake Designer",
    priceRange: "Mid-Range",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.8,
    description:
      "Beautiful and delicious wedding cakes tailored to your theme. From classic tiers to modern designs.",
    contact: {
      phone: "+2348099012346",
      email: "orders@cakesbytobi.com",
      instagram: "@cakesbytobi",
      website: "cakesbytobi.com",
    },
    dataAiHint: "wedding cake",
  },
  {
    id: "v10",
    name: "Aso Ebi Palace",
    category: "Aso Ebi Supplier",
    priceRange: "Premium",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 4.6,
    description:
      "High-quality fabrics for your Aso Ebi, ensuring your family and friends look coordinated and elegant.",
    contact: {
      phone: "+2348100123457",
      email: "sales@asoebipalace.com",
      instagram: "@asoebipalace",
      website: "asoebipalace.com",
    },
    dataAiHint: "traditional fabric",
  },
  {
    id: "v11",
    name: "The Perfect Plan NG",
    category: "Wedding Planner",
    priceRange: "Very Luxury",
    location: "Lagos, NG",
    imageUrl: "https://placehold.co/600x400.png",
    rating: 5.0,
    description:
      "Full-service wedding planning for a seamless and stress-free experience from start to finish.",
    contact: {
      phone: "+2348111234568",
      email: "hello@theperfectplan.ng",
      instagram: "@theperfectplanng",
      website: "theperfectplan.ng",
    },
    dataAiHint: "event planning",
  },
];

export const mockGuests: Guest[] = [
  {
    id: "g1",
    name: "Chief Emeka Okoro",
    rsvp_status: "Accepted",
    dietaryRestrictions: "None",
    tableAssignment: "Table 1",
    event: "Traditional Wedding",
  },
  {
    id: "g2",
    name: "Hajiya Aisha Bello",
    rsvp_status: "Accepted",
    dietaryRestrictions: "Vegetarian",
    tableAssignment: "Table 1",
    event: "Traditional Wedding",
  },
  {
    id: "g3",
    name: "Dr. Funmi Williams",
    rsvp_status: "Pending",
    dietaryRestrictions: "",
    tableAssignment: "",
    event: "Traditional Wedding",
  },
  {
    id: "g4",
    name: "Mr. Tunde Adebayo",
    rsvp_status: "Declined",
    dietaryRestrictions: "",
    tableAssignment: "",
    event: "Traditional Wedding",
  },
  {
    id: "g5",
    name: "Miss Chioma Eze",
    rsvp_status: "Accepted",
    dietaryRestrictions: "No nuts",
    tableAssignment: "Table 2",
    event: "Traditional Wedding",
  },
  {
    id: "g6",
    name: "The Ojo Family",
    rsvp_status: "Accepted",
    dietaryRestrictions: "",
    tableAssignment: "Table 3",
    event: "Traditional Wedding",
  },
  {
    id: "g7",
    name: "Mr. & Mrs. Alabi",
    rsvp_status: "Accepted",
    dietaryRestrictions: "",
    tableAssignment: "Table 3",
    event: "White Wedding Reception",
  },
  {
    id: "g8",
    name: "Femi Kuti",
    rsvp_status: "Pending",
    dietaryRestrictions: "",
    tableAssignment: "",
    event: "White Wedding Reception",
  },
  {
    id: "g9",
    name: "Sade Adu",
    rsvp_status: "Accepted",
    dietaryRestrictions: "Vegan",
    tableAssignment: "Table 4",
    event: "White Wedding Reception",
  },
  {
    id: "g10",
    name: "Ngozi Okonjo-Iweala",
    rsvp_status: "Pending",
    dietaryRestrictions: "",
    tableAssignment: "",
    event: "White Wedding Reception",
  },
  {
    id: "g11",
    name: "Wole Soyinka",
    rsvp_status: "Declined",
    dietaryRestrictions: "",
    tableAssignment: "",
    event: "White Wedding Reception",
  },
  {
    id: "g12",
    name: "Chimamanda Ngozi Adichie",
    rsvp_status: "Accepted",
    dietaryRestrictions: "",
    tableAssignment: "Table 4",
    event: "White Wedding Reception",
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "e1",
    name: "Venue Deposit",
    category: "Venue",
    amount: 1500000,
    date: new Date("2025-01-10"),
    event: "White Wedding Reception",
  },
  {
    id: "e2",
    name: "Catering Downpayment",
    category: "Caterer",
    amount: 500000,
    date: new Date("2025-02-05"),
    event: "White Wedding Reception",
  },
  {
    id: "e3",
    name: "Aso Ebi Fabric",
    category: "Attire",
    amount: 350000,
    date: new Date("2025-03-15"),
    event: "Traditional Wedding",
  },
  {
    id: "e4",
    name: "Photography Retainer",
    category: "Photographer",
    amount: 250000,
    date: new Date("2025-02-01"),
    event: "Traditional Wedding",
  },
];

export const mockBudget = {
  total: 7500000,
};
