export interface Property {
  id: string;
  title: string;
  description: string | null;
  location: string;
  price: number;
  price_label: string | null;
  bedrooms: number;
  bathrooms: number;
  size_sqm: number | null;
  size_label: string | null;
  property_type: string;
  status: "ready" | "off-plan" | "sold";
  listing_type: "buy" | "rent";
  featured: boolean;
  image_url: string | null;
  units_available: number | null;
  created_at?: string;
  images: string[] | null;
  amenities: string[] | null;
  neighbourhood?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  slug?: string | null;
  seo_keywords?: string | null;
  units?: {
    type: string;
    size?: string;
    price?: string;
    expected_rent?: string;
  }[] | null;
}

export const MOCK_PROPERTIES: Property[] = [
  {
    id: "mock-1",
    title: "The Runda Sovereign Mansion – 6 Bedroom Diplomatic Villa",
    description: "Nestled in the prestigious diplomatic enclave of Runda, this architectural masterpiece offers the pinnacle of secure, ultra-luxury living. Set on a beautifully landscaped half-acre plot, the mansion blends contemporary design with warm wood accents and premium stone finishes.\n\nInside, an expansive triple-height foyer welcomes you, leading to three grand living rooms, a formal dining area, and a fully equipped chef's kitchen featuring state-of-the-art German appliances. All six ensuite bedrooms are generously proportioned, with the master suite boasting a walk-in wardrobe, a spa-like bathroom, and a spacious wrap-around balcony overlooking the pool.\n\nOutdoor spaces are designed for world-class entertainment, featuring a heated double-infinity swimming pool, a fully fitted outdoor kitchen, and manicured lawns. The home also includes an automated smart security system, high-speed fiber internet, and comprehensive backup facilities.",
    location: "Runda, Nairobi",
    price: 350000000,
    price_label: "KSh 350M",
    bedrooms: 6,
    bathrooms: 6,
    size_sqm: 790,
    size_label: "790 SQM",
    property_type: "Villa",
    status: "ready",
    listing_type: "buy",
    featured: true,
    image_url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
    units_available: 1,
    created_at: "2025-12-24T10:00:00.000000+00:00",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
    ],
    amenities: [
      "24/7 Smart Security System",
      "Double Infinity Heated Pool",
      "Fully Fitted Outdoor Kitchen",
      "Manicured Mature Gardens",
      "Two-bedroom Staff Quarters",
      "Full Backup Generator",
      "Borehole & Water Purification",
      "Home Cinema Room",
      "Wine Cellar"
    ],
    neighbourhood: "Runda Diplomatic Enclave",
    slug: "runda-sovereign-mansion-6-bedroom-diplomatic-villa",
    units: [
      {
        type: "6 Bedroom Villa + DSQ",
        size: "790",
        price: "KSh 350,000,000",
        expected_rent: "KSh 1,200,000"
      }
    ]
  },
  {
    id: "mock-2",
    title: "Riverside Prestige Duplex – 4 Bedroom Penthouse",
    description: "Located on one of Riverside’s most peaceful, tree-lined avenues, this magnificent top-floor duplex penthouse redefines modern executive living. Featuring double-height ceilings and massive floor-to-ceiling glass panels, the home is filled with natural light and captures breathtaking views of the Kirichwa River valley.\n\nThe lower level features a grand living room with a solid teak floor, a separate dining bay, and an open-plan German modular kitchen. A floating hardwood staircase leads to the upper level, which houses a private family lounge and the primary sleeping quarters.\n\nResidents at Riverside Prestige enjoy premium wellness facilities, including an elevated infinity pool, a residents-only sky lounge, steam room, sauna, and a fully equipped panoramic gym.",
    location: "Riverside Drive, Nairobi",
    price: 72000000,
    price_label: "KSh 72M",
    bedrooms: 4,
    bathrooms: 4,
    size_sqm: 380,
    size_label: "380 SQM",
    property_type: "Penthouse",
    status: "ready",
    listing_type: "buy",
    featured: true,
    image_url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
    units_available: 1,
    created_at: "2025-12-25T11:00:00.000000+00:00",
    images: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200"
    ],
    amenities: [
      "Rooftop Sky Lounge",
      "Heated Swimming Pool",
      "Hardwood Floating Staircase",
      "Panoramic Wellness Gym",
      "Full Backup Generator",
      "Borehole Water Supply",
      "Dedicated Concierge Desk",
      "Secure Underground Parking"
    ],
    neighbourhood: "Riverside Drive",
    slug: "riverside-prestige-duplex-4-bedroom-penthouse",
    units: [
      {
        type: "4 Bedroom Penthouse",
        size: "380",
        price: "KSh 72,000,000",
        expected_rent: "KSh 450,000"
      }
    ]
  },
  {
    id: "mock-3",
    title: "Lavington Heights Executive – 3 Bedroom Townhouse",
    description: "This sleek, modern triplex townhouse is nestled in a highly secure, gated community of only six units in Lavington. Ideal for modern families, the home is a perfect blend of space, aesthetics, and functionality.\n\nThe ground floor features a spacious sunken living room with an open fireplace, a guest cloakroom, and a separate kitchen with granite countertops. The first floor hosts two spacious ensuite bedrooms, while the entire second floor is dedicated to the massive master suite, complete with a walking closet and private terrace.\n\nLocated within close proximity to Lavington Mall, Jafferys Sports Club, and international schools like Loreto Convent and Braeside.",
    location: "Lavington, Nairobi",
    price: 45000000,
    price_label: "KSh 45M",
    bedrooms: 3,
    bathrooms: 3,
    size_sqm: 280,
    size_label: "280 SQM",
    property_type: "Townhouse",
    status: "ready",
    listing_type: "buy",
    featured: true,
    image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
    units_available: 1,
    created_at: "2025-12-26T12:00:00.000000+00:00",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200"
    ],
    amenities: [
      "Private Sunken Fireplace",
      "Rooftop Private Terrace",
      "Secure Gated Community",
      "Granite Countertops",
      "Solar Water Heating",
      "Borehole & Generator",
      "Intercom System",
      "Staff Quarters for One"
    ],
    neighbourhood: "Lavington",
    slug: "lavington-heights-executive-3-bedroom-townhouse",
    units: [
      {
        type: "3 Bedroom Townhouse",
        size: "280",
        price: "KSh 45,000,000",
        expected_rent: "KSh 250,000"
      }
    ]
  },
  {
    id: "mock-4",
    title: "Kilimani Vista – Premium 2 Bedroom Residences",
    description: "Discover affordable luxury and high investment returns at Kilimani Vista. Currently under construction, these modern 2-bedroom executive apartments are designed to maximize space and natural light, making them perfect for young professionals and investors alike.\n\nEach apartment features an open-plan kitchen and dining area, a utility yard, a cozy living room opening to a balcony, and two spacious ensuite bedrooms. High-quality Turkish tiles, modern sanitary ware, and pre-fitted closets are used throughout.\n\nKilimani Vista offers standard-setting amenities, including a rooftop pool and gym, backup power generator, solar hot water system, speed lift, and round-the-clock professional security.",
    location: "Kilimani, Nairobi",
    price: 16500000,
    price_label: "KSh 16.5M",
    bedrooms: 2,
    bathrooms: 2,
    size_sqm: 120,
    size_label: "120 SQM",
    property_type: "Apartment",
    status: "off-plan",
    listing_type: "buy",
    featured: true,
    image_url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
    units_available: 4,
    created_at: "2025-12-27T13:00:00.000000+00:00",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=1200"
    ],
    amenities: [
      "Rooftop Heated Pool",
      "Fully Equipped Gym",
      "Turkish Tile Finishes",
      "Open Plan Living Area",
      "High-speed Elevators",
      "Standby Generator",
      "Solar Water Heaters",
      "CCTV & Biometric Access"
    ],
    neighbourhood: "Kilimani",
    slug: "kilimani-vista-premium-2-bedroom-residences",
    units: [
      {
        type: "2 Bedroom Executive",
        size: "120",
        price: "KSh 16,500,000",
        expected_rent: "KSh 120,000"
      }
    ]
  }
];
