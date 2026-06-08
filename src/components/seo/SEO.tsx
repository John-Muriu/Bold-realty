import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string | string[];
    image?: string;
    url?: string;
    type?: "website" | "article" | "product" | "property" | "blog" | "location page";
    schema?: object;
}

const SEO = ({
    title,
    description = "Discover premium properties, luxury apartments, and exclusive homes for sale and rent in Nairobi's most sought-after locations like Kilimani, Westlands, and Karen.",
    keywords = "Bold Realty, real estate Kenya, luxury apartments Nairobi, buy home Kenya, rent apartment Kilimani",
    image = "/bold-realty-logo.png",
    url = "",
    type = "website",
    schema
}: SEOProps) => {
    // Generate clean page title
    const siteTitle = title.includes("Bold Realty") 
        ? title 
        : `${title} | Bold Realty - Premier Real Estate in Kenya`;

    // Process canonical URL
    const cleanPath = url.startsWith("/") ? url : `/${url}`;
    const fullUrl = url 
        ? (url.startsWith("http") ? url : `https://boldrealty.co.ke${cleanPath}`) 
        : "https://boldrealty.co.ke";

    // Format keywords to a comma-separated string if passed as an array
    const keywordsString = Array.isArray(keywords) 
        ? keywords.join(", ") 
        : keywords;

    // Map custom types to standard Open Graph types
    let ogType = "website";
    if (type === "article" || type === "blog") {
        ogType = "article";
    } else if (type === "product" || type === "property") {
        ogType = "product";
    }

    // Default Organization Schema if none provided
    const defaultSchema = {
        "@context": "https://schema.org",
        "@type": "RealEstateAgent",
        "name": "Bold Realty",
        "image": "https://boldrealty.co.ke/bold-realty-logo.png",
        "description": description,
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "Argwings Kodhek Road",
            "addressLocality": "Kilimani, Nairobi",
            "addressRegion": "Nairobi",
            "postalCode": "00100",
            "addressCountry": "KE"
        },
        "telephone": "+254725316343",
        "url": "https://boldrealty.co.ke"
    };

    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{siteTitle}</title>
            <meta name="description" content={description} />
            {keywordsString && <meta name="keywords" content={keywordsString} />}
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Bold Realty" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={fullUrl} />
            <meta property="twitter:title" content={siteTitle} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(schema || defaultSchema)}
            </script>
        </Helmet>
    );
};

export default SEO;
