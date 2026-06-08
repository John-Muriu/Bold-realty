/**
 * Helper to generate a clean, URL-safe slug from a string.
 */
export const generateSlug = (text: string): string => {
  if (!text) return "";
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters
    .trim()
    .replace(/\s+/g, "-")    // Replace spaces with single hyphens
    .replace(/-+/g, "-");    // Collapse consecutive hyphens
};

/**
 * Builds the correct programmatic URL path based on property type, status, and location.
 * Patterns:
 * - /off-plan/:location/:slug (for off-plan properties)
 * - /apartments/:location/:slug (for apartment/studio types)
 * - /luxury-homes/:location/:slug (for high-priced or villa/penthouse types)
 * - /properties/:location/:slug (default fallback)
 */
export const getPropertyUrl = (property: any): string => {
  if (!property) return "/properties";

  // Extract location area (e.g. "Westlands" from "Westlands, Nairobi")
  const area = property.location
    ? generateSlug(property.location.split(",")[0])
    : "nairobi";

  const slug = property.slug || generateSlug(property.title) || property.id;
  const typeLower = (property.property_type || "").toLowerCase();

  if (property.status === "off-plan") {
    return `/off-plan/${area}/${slug}`;
  }

  if (typeLower.includes("apartment") || typeLower.includes("studio")) {
    return `/apartments/${area}/${slug}`;
  }

  // Luxury classification: price >= KSh 50M or property type is Villa/Penthouse
  const price = typeof property.price === "string" ? parseFloat(property.price) : (property.price || 0);
  if (typeLower.includes("villa") || typeLower.includes("penthouse") || price >= 50000000) {
    return `/luxury-homes/${area}/${slug}`;
  }

  return `/properties/${area}/${slug}`;
};

/**
 * Generates Google-compliant JSON-LD structured schema for property listings.
 * Supports ApartmentComplex, House (Villa/Townhouse), CommercialProperty, and Off-plan projects.
 */
export const generatePropertySchema = (property: any): object | null => {
  if (!property) return null;

  // Map property_type to schema.org Type
  let schemaType = "RealEstateListing"; // Default listing wrapper type
  let itemType = "SingleFamilyResidence"; // Default offered item type
  
  const typeLower = (property.property_type || "").toLowerCase();
  
  if (typeLower.includes("apartment") || typeLower.includes("studio") || typeLower.includes("penthouse")) {
    schemaType = "ApartmentComplex";
    itemType = "Apartment";
  } else if (typeLower.includes("villa") || typeLower.includes("house") || typeLower.includes("townhouse") || typeLower.includes("maisonette")) {
    schemaType = "House";
    itemType = "House";
  } else if (typeLower.includes("commercial") || typeLower.includes("office") || typeLower.includes("retail")) {
    schemaType = "CommercialProperty";
    itemType = "CommercialProperty";
  }

  // Location decomposition
  const location = property.location || "Nairobi, Kenya";
  const addressParts = location.split(",").map((p: string) => p.trim());
  const locality = addressParts[0] || "Nairobi";
  const region = addressParts[1] || "Nairobi";
  const country = addressParts[2] || "KE";

  const price = typeof property.price === "string" ? parseFloat(property.price) : (property.price || 0);
  const isRent = property.listing_type === "rent";

  // Build the underlying accommodation item description
  const itemOffered: any = {
    "@type": itemType,
    "name": property.title,
    "description": property.description || `Premium ${property.property_type} in ${property.location}`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": locality,
      "addressRegion": region,
      "addressCountry": country
    }
  };

  // Add developer/builder if available (especially for off-plan)
  if (property.developer || property.developer_name) {
    itemOffered.builder = {
      "@type": "Organization",
      "name": property.developer || property.developer_name
    };
  }

  // Bed/Bath counts
  if (property.bedrooms !== undefined && property.bedrooms !== null) {
    itemOffered.numberOfRooms = property.bedrooms;
    itemOffered.numberOfBedrooms = property.bedrooms;
  }
  if (property.bathrooms !== undefined && property.bathrooms !== null) {
    itemOffered.numberOfBathroomsTotal = property.bathrooms;
  }

  // Square footage size
  if (property.size_sqm) {
    itemOffered.floorSize = {
      "@type": "QuantitativeValue",
      "value": Number(property.size_sqm),
      "unitCode": "MTK" // Square meters code
    };
  }

  // Amenities dynamic mapping
  if (property.amenities && Array.isArray(property.amenities) && property.amenities.length > 0) {
    itemOffered.amenityFeature = property.amenities.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity,
      "value": true
    }));
  }

  // Availability status mapping
  const availabilityMap: Record<string, string> = {
    "ready": "https://schema.org/InStock",
    "off-plan": "https://schema.org/PreOrder",
    "sold": "https://schema.org/OutOfStock"
  };

  // Final wrapped RealEstateListing schema
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "url": `${window.location.origin}${getPropertyUrl(property)}`,
    "datePosted": property.created_at || new Date().toISOString().split("T")[0],
    "priceCurrency": "KES",
    "price": price,
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "KES",
      "availability": availabilityMap[property.status] || "https://schema.org/InStock",
      "businessFunction": isRent ? "https://schema.org/leaseOut" : "https://schema.org/sell"
    },
    "about": itemOffered
  };
};

/**
 * Generates dynamic BlogPosting structured schema for insights/articles.
 */
export const generateBlogSchema = (post: any): object | null => {
  if (!post) return null;

  const images = post.image || post.image_url
    ? [post.image || post.image_url]
    : ["https://boldrealty.co.ke/bold-realty-logo.png"];

  // Handle date formatting
  let isoDate = new Date().toISOString();
  if (post.date) {
    try {
      isoDate = new Date(post.date).toISOString();
    } catch (e) {
      // Keep current date if parsing fails
    }
  } else if (post.published_at) {
    isoDate = post.published_at;
  }

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${window.location.origin}/insights/${post.slug || post.id}`
    },
    "headline": post.title,
    "description": post.excerpt || post.description || "",
    "image": images,
    "datePublished": isoDate,
    "dateModified": post.updated_at || isoDate,
    "author": {
      "@type": "Person",
      "name": post.author || "Bold Realty Insights Team"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bold Realty",
      "logo": {
        "@type": "ImageObject",
        "url": "https://boldrealty.co.ke/bold-realty-logo.png"
      }
    }
  };
};
