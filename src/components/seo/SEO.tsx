import { Helmet } from "react-helmet-async";

interface SEOProps {
    title: string;
    description?: string;
    image?: string;
    url?: string;
    type?: "website" | "article" | "product";
    schema?: object;
}

const SEO = ({
    title,
    description = "Discover premium properties, luxury apartments, and exclusive homes for sale and rent in Nairobi's most sought-after locations like Kilimani, Westlands, and Karen.",
    image = "/bold-realty-logo.png",
    url = "https://boldrealty.co.ke",
    type = "website",
    schema
}: SEOProps) => {
    const siteTitle = `${title} | Bold Realty - Premier Real Estate in Kenya`;
    const fullUrl = url.startsWith("http") ? url : `https://boldrealty.co.ke${url}`;

    // Default Organization Schema
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
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={siteTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

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
