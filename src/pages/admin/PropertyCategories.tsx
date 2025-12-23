import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Trash2, Plus, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    category_type: 'property_type' | 'listing_type';
}

const PropertyCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    // Form states
    const [newItemName, setNewItemName] = useState("");
    const [newItemType, setNewItemType] = useState<'property_type' | 'listing_type'>('property_type');
    const [adding, setAdding] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('property_categories')
                .select('*')
                .order('name');

            if (error) throw error;
            setCategories(data || []);
        } catch (error) {
            console.error('Error fetching categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim()) return;

        setAdding(true);
        try {
            const { error } = await supabase
                .from('property_categories')
                .insert([{
                    name: newItemName.trim(),
                    category_type: newItemType
                }]);

            if (error) throw error;

            toast.success('Category added successfully');
            setNewItemName("");
            fetchCategories();
        } catch (error: any) {
            console.error('Error adding category:', error);
            if (error.code === '23505') {
                toast.error('This category already exists');
            } else {
                toast.error('Failed to add category');
            }
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        try {
            const { error } = await supabase
                .from('property_categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast.success('Category deleted');
            setCategories(categories.filter(c => c.id !== id));
        } catch (error) {
            console.error('Error deleting category:', error);
            toast.error('Failed to delete category');
        }
    };

    const propertyTypes = categories.filter(c => c.category_type === 'property_type');
    const listingTypes = categories.filter(c => c.category_type === 'listing_type');

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Button variant="ghost" asChild>
                    <Link to="/admin/properties">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Properties
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold font-display text-gray-900">
                    Manage Property & Listing Types
                </h1>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Add New Section */}
                <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
                    <form onSubmit={handleAdd} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                value={newItemName}
                                onChange={(e) => setNewItemName(e.target.value)}
                                placeholder="e.g. Bungalow or Short Term"
                                required
                            />
                        </div>
                        <div className="w-48">
                            <label className="block text-sm font-medium mb-1">Type</label>
                            <select
                                value={newItemType}
                                onChange={(e) => setNewItemType(e.target.value as any)}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            >
                                <option value="property_type">Property Type</option>
                                <option value="listing_type">Listing Type</option>
                            </select>
                        </div>
                        <Button type="submit" variant="gold" disabled={adding}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add
                        </Button>
                    </form>
                </div>

                {/* Property Types List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                        Property Types
                        <span className="text-sm font-normal text-muted-foreground">{propertyTypes.length} items</span>
                    </h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
                            propertyTypes.length === 0 ? <p className="text-sm text-gray-400 italic">No types added yet.</p> :
                                propertyTypes.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                        <span className="font-medium">{item.name}</span>
                                        <button
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>

                {/* Listing Types List */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 flex items-center justify-between">
                        Listing Types
                        <span className="text-sm font-normal text-muted-foreground">{listingTypes.length} items</span>
                    </h2>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {loading ? <p className="text-sm text-gray-500">Loading...</p> : (
                            listingTypes.length === 0 ? <p className="text-sm text-gray-400 italic">No types added yet.</p> :
                                listingTypes.map(item => (
                                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group">
                                        <span className="font-medium">{item.name}</span>
                                        <button
                                            onClick={() => handleDelete(item.id, item.name)}
                                            className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyCategories;
