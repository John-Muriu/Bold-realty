import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

interface Unit {
    type: string;
    price: string;
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
        const { data } = await supabase.from('property_categories').select('*');
        if (data) {
            setCategories({
                property_type: data.filter(c => c.category_type === 'property_type'),
                listing_type: data.filter(c => c.category_type === 'listing_type'),
            });
        }
    };

    const fetchProperty = async () => {
        const { data } = await supabase.from("properties").select("*").eq("id", id).single();
        if (data) {
            setFormData({
                ...data,
                price: data.price.toString(),
                bedrooms: data.bedrooms.toString(),
                bathrooms: data.bathrooms.toString(),
                size_sqm: data.size_sqm?.toString() || "",
                images: data.images || [data.image_url],
                neighbourhood: data.neighbourhood || ""
            });

            // Parse amenities array to string
            if (data.amenities && Array.isArray(data.amenities)) {
                setAmenitiesInput(data.amenities.join(", "));
            }

            // Parse units jsonb
            if (data.units && Array.isArray(data.units)) {
                setUnits(data.units);
            }
        }
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
        setUnits([...units, { type: "", price: "" }]);
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

        const propertyData = {
            ...formData,
            price: parseFloat(formData.price),
            bedrooms: parseInt(formData.bedrooms),
            bathrooms: parseInt(formData.bathrooms),
            size_sqm: formData.size_sqm ? parseInt(formData.size_sqm) : null,
            images: formData.images,
            neighbourhood: formData.neighbourhood,
            amenities: amenitiesArray,
            units: units // Supabase handles JSONB automatically from JS objects/arrays
        };

        if (id) {
            const { error } = await supabase.from("properties").update(propertyData).eq("id", id);
            if (error) {
                console.error(error);
                toast.error("Error updating property");
            } else {
                toast.success("Property updated successfully");
                navigate("/admin/properties");
            }
        } else {
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
                            <Input name="title" value={formData.title} onChange={handleChange} required placeholder="e.g. Luxury Villa in Karen" />
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
                                {categories.property_type.length > 0 ? (
                                    categories.property_type.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))
                                ) : (
                                    <option value="Apartment">Apartment</option> // Fallback
                                )}
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
                                {categories.listing_type.length > 0 ? (
                                    categories.listing_type.map(c => (
                                        <option key={c.id} value={c.name}>{c.name}</option>
                                    ))
                                ) : (
                                    <option value="buy">For Sale</option> // Fallback
                                )}
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

                    <div className="space-y-3">
                        {units.map((unit, index) => (
                            <div key={index} className="flex gap-4 items-end bg-gray-50 p-3 rounded-lg">
                                <div className="flex-1">
                                    <label className="block text-xs font-medium mb-1">Unit Type</label>
                                    <Input
                                        value={unit.type}
                                        onChange={(e) => updateUnit(index, 'type', e.target.value)}
                                        placeholder="e.g. 1 Bedroom"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-medium mb-1">Price (Description)</label>
                                    <Input
                                        value={unit.price}
                                        onChange={(e) => updateUnit(index, 'price', e.target.value)}
                                        placeholder="e.g. 6.5M - 7M"
                                    />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeUnit(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        ))}
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
