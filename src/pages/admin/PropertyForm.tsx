import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";
import { generateSlug } from "@/utils/seo-utils";

interface Unit {
    type: string;
    size?: string;
    price: string;
    expected_rent?: string;
}

const PropertyForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Admin Inputs
    const [amenitiesInput, setAmenitiesInput] = useState("");
    const [units, setUnits] = useState<Unit[]>([]);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        location: "",
        price: "",
        image_url: "",
        images: [] as string[],
        bedrooms: "",
        bathrooms: "",
        size_sqm: "",
        property_type: "Apartment",
        listing_type: "buy",
        status: "ready",
        featured: false,
        neighbourhood: "",
        seo_title: "",
        seo_description: "",
        slug: "",
        seo_keywords: "",
    });

    const [categories, setCategories] = useState<{ property_type: any[], listing_type: any[] }>({
        property_type: [],
        listing_type: []
    });

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProperty();
        }
    }, [id]);

    const fetchCategories = async () => {
        // @ts-ignore
        const { data } = await supabase.from('property_categories').select('*');
        if (data) {
            const categoriesData = data as any[];
            setCategories({
                property_type: categoriesData.filter(c => c.category_type === 'property_type'),
                listing_type: categoriesData.filter(c => c.category_type === 'listing_type'),
            });
        }
    };

    const fetchProperty = async () => {
        const { data } = await supabase.from("properties").select("*").eq("id", id).single();
        if (data) {
            // Safe casting and defaulting
            const property: any = data;
            setFormData({
                title: property.title,
                description: property.description || "",
                location: property.location,
                price: property.price.toString(),
                image_url: property.image_url || "",
                images: property.images || [property.image_url],
                bedrooms: property.bedrooms.toString(),
                bathrooms: property.bathrooms.toString(),
                size_sqm: property.size_sqm?.toString() || "",
                property_type: property.property_type,
                listing_type: property.listing_type,
                status: property.status,
                featured: property.featured,
                neighbourhood: property.neighbourhood || "",
                seo_title: property.seo_title || "",
                seo_description: property.seo_description || "",
                slug: property.slug || "",
                seo_keywords: property.seo_keywords || "",
            });

            if (property.slug) {
                setIsSlugManuallyEdited(true);
            }

            // Parse amenities array to string
            if (property.amenities && Array.isArray(property.amenities)) {
                setAmenitiesInput(property.amenities.join(", "));
            }

            // Parse units jsonb
            if (property.units && Array.isArray(property.units)) {
                setUnits(property.units);
            }
        }
    };

    const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setFormData(prev => {
            const updated = { ...prev, title };
            if (!isSlugManuallyEdited) {
                updated.slug = generateSlug(title);
            }
            return updated;
        });
    };

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const slug = e.target.value;
        setIsSlugManuallyEdited(true);
        setFormData(prev => ({ ...prev, slug }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleImagesUploaded = (urls: string[]) => {
        setFormData(prev => ({
            ...prev,
            images: urls,
            image_url: urls[0] || ""
        }));
    };

    // Units Logic
    const addUnit = () => {
        setUnits([...units, { type: "", size: "", price: "", expected_rent: "" }]);
    };

    const removeUnit = (index: number) => {
        setUnits(units.filter((_, i) => i !== index));
    };

    const updateUnit = (index: number, field: keyof Unit, value: string) => {
        const newUnits = [...units];
        newUnits[index][field] = value;
        setUnits(newUnits);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Process Amenities
        const amenitiesArray = amenitiesInput.split(",").map(item => item.trim()).filter(Boolean);

        // Ensure a clean slug is generated if blank
        const finalSlug = formData.slug ? generateSlug(formData.slug) : generateSlug(formData.title);

        const propertyData = {
            title: formData.title,
            description: formData.description,
            location: formData.location,
            price: parseFloat(formData.price),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            size_sqm: formData.size_sqm ? parseInt(formData.size_sqm) : null,
            property_type: formData.property_type,
            listing_type: formData.listing_type as "buy" | "rent",
            status: formData.status as "ready" | "off-plan" | "sold",
            featured: formData.featured,
            image_url: formData.image_url,
            images: formData.images,
            neighbourhood: formData.neighbourhood,
            amenities: amenitiesArray,
            units: units,
            seo_title: formData.seo_title,
            seo_description: formData.seo_description,
            slug: finalSlug,
            seo_keywords: formData.seo_keywords,
        };

        if (id) {
            // @ts-ignore - Ignoring TS error for dynamic SEO fields potentially missing in strict types until generated
            const { error } = await supabase.from("properties").update(propertyData).eq("id", id);
            if (error) {
                console.error(error);
                toast.error("Error updating property");
            } else {
                toast.success("Property updated successfully");
                navigate("/admin/properties");
            }
        } else {
            // @ts-ignore - Ignoring TS error for dynamic SEO fields potentially missing in strict types until generated
            const { error } = await supabase.from("properties").insert([propertyData]);
            if (error) {
                console.error(error);
                toast.error("Error creating property");
            } else {
                toast.success("Property created successfully");
                navigate("/admin/properties");
            }
        }
        setLoading(false);
    };

    const defaultTypes = ["Apartment", "Maisonette", "Villa", "Studio", "Townhouse"];
    const displayedPropertyTypes = Array.from(
        new Set([
            ...categories.property_type.map(c => c.name),
            ...defaultTypes
        ])
    );

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" onClick={() => navigate("/admin/properties")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <h1 className="text-3xl font-bold font-display text-gray-900">
                    {id ? "Edit Property" : "Add New Property"}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-8">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium mb-1">Title</label>
                            <Input name="title" value={formData.title} onChange={handleTitleChange} required placeholder="e.g. Luxury Villa in Karen" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. Kilimani, Nairobi" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Starting Price (KES)</label>
                            <Input name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="25000000" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Property Type</label>
                            <select
                                name="property_type"
                                value={formData.property_type}
                                onChange={handleChange}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                {displayedPropertyTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Listing Type</label>
                            <select
                                name="listing_type"
                                value={formData.listing_type}
                                onChange={handleChange}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="buy">For Sale</option>
                                <option value="rent">For Rent</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="ready">Ready</option>
                                <option value="off-plan">Off-Plan</option>
                                <option value="sold">Sold</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-3 gap-4 col-span-2 md:col-span-1">
                            <div>
                                <label className="block text-sm font-medium mb-1">Bedrooms</label>
                                <Input name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Bathrooms</label>
                                <Input name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Size (sqm)</label>
                                <Input name="size_sqm" type="number" value={formData.size_sqm} onChange={handleChange} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Media */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Media</h3>
                    <div className="col-span-2">
                        <label className="block text-sm font-medium mb-2">Property Images</label>
                        <ImageUpload
                            onImagesUploaded={handleImagesUploaded}
                            existingImages={formData.images}
                            maxImages={10}
                        />
                        <p className="text-xs text-muted-foreground mt-2">Images will be automatically watermarked.</p>
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">Property Details</h3>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea name="description" value={formData.description} onChange={handleChange} className="h-32" required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Neighbourhood Description</label>
                        <Textarea
                            name="neighbourhood"
                            value={formData.neighbourhood}
                            onChange={handleChange}
                            className="h-24"
                            placeholder="Describe the area, nearby schools, malls, accessibility..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Amenities</label>
                        <Input
                            value={amenitiesInput}
                            onChange={(e) => setAmenitiesInput(e.target.value)}
                            placeholder="Swimming Pool, Gym, Backup Generator, Borehole (Comma separated)"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Separate amenities with commas.</p>
                    </div>
                </div>

                {/* Units */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                        <h3 className="text-lg font-semibold">Units Available</h3>
                        <Button type="button" variant="outline" size="sm" onClick={addUnit}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Unit Type
                        </Button>
                    </div>

                    {units.length === 0 && (
                        <p className="text-sm text-gray-400 italic">No specific units added yet.</p>
                    )}

                    <div className="space-y-4">
                        {units.map((unit, index) => (
                            <div key={index} className="relative bg-gray-50/70 p-5 rounded-xl border border-gray-100/80 space-y-4 md:space-y-0 md:flex md:gap-4 md:items-end">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Unit Type</label>
                                    <Input
                                        value={unit.type}
                                        onChange={(e) => updateUnit(index, 'type', e.target.value)}
                                        placeholder="e.g. 1 Bedroom"
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                                <div className="w-full md:w-32">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Size (sqm)</label>
                                    <Input
                                        value={unit.size || ""}
                                        onChange={(e) => updateUnit(index, 'size', e.target.value)}
                                        placeholder="e.g. 55 sqm"
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Cash Price</label>
                                    <Input
                                        value={unit.price}
                                        onChange={(e) => updateUnit(index, 'price', e.target.value)}
                                        placeholder="e.g. KSh 6,500,000"
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Expected Rent</label>
                                    <Input
                                        value={unit.expected_rent || ""}
                                        onChange={(e) => updateUnit(index, 'expected_rent', e.target.value)}
                                        placeholder="e.g. KSh 70,000/month"
                                        className="bg-white border-gray-200"
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeUnit(index)} className="mt-4 md:mt-0 flex-shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SEO Settings */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold border-b pb-2">SEO Settings</h3>
                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Title</label>
                        <Input
                            name="seo_title"
                            value={formData.seo_title || ""}
                            onChange={handleChange}
                            placeholder="e.g. Clermont Residence – Nairobi Apartments for Sale in Westlands"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended length: 50-60 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Meta Description</label>
                        <Textarea
                            name="seo_description"
                            value={formData.seo_description || ""}
                            onChange={handleChange}
                            placeholder="e.g. Discover Clermont Residence Nairobi apartments for sale..."
                            className="h-24"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Recommended length: 150-160 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Slug (URL)</label>
                        <Input
                            name="slug"
                            value={formData.slug || ""}
                            onChange={handleSlugChange}
                            placeholder="e.g. clermont-residence-nairobi-apartments-for-sale"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Use hyphens, no spaces. Leave blank to auto-generate from title.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Keywords</label>
                        <Input
                            name="seo_keywords"
                            value={formData.seo_keywords || ""}
                            onChange={handleChange}
                            placeholder="e.g. Nairobi apartments, Westlands for sale, luxury homes"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Comma separated</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t">
                    <input
                        type="checkbox"
                        name="featured"
                        id="featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="featured" className="text-sm font-medium">Mark as Featured Property</label>
                </div>

                <div className="flex justify-end pt-6">
                    <Button type="submit" variant="gold" size="lg" disabled={loading}>
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Saving..." : "Save Property"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;
