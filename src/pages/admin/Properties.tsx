import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const AdminProperties = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        const { data } = await supabase.from("properties").select("*").order("created_at", { ascending: false });
        if (data) setProperties(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this property?")) {
            await supabase.from("properties").delete().eq("id", id);
            fetchProperties();
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold font-display text-gray-900">Properties</h1>
                <div className="flex gap-4">
                    <Button variant="outline" asChild>
                        <Link to="/admin/properties/types">
                            Manage Types
                        </Link>
                    </Button>
                    <Button variant="gold" asChild>
                        <Link to="/admin/properties/new">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Property
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">Loading...</TableCell>
                            </TableRow>
                        ) : properties.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-10">No properties found.</TableCell>
                            </TableRow>
                        ) : (
                            properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <img
                                            src={property.image_url || "/placeholder.png"}
                                            alt={property.title}
                                            className="w-12 h-12 object-cover rounded-lg"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium">{property.title}</TableCell>
                                    <TableCell>{property.location}</TableCell>
                                    <TableCell>KSh {property.price.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/admin/properties/${property.id}/edit`}>
                                                    <Pencil className="w-4 h-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="destructive" size="sm" onClick={() => handleDelete(property.id)}>
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminProperties;
