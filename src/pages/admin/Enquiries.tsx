import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";

const AdminEnquiries = () => {
    const [enquiries, setEnquiries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [contactedIds, setContactedIds] = useState<string[]>(() => {
        const saved = localStorage.getItem("contacted_enquiry_ids");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    const fetchEnquiries = async () => {
        const { data } = await supabase.from("inquiries").select("*").order("created_at", { ascending: false });
        if (data) setEnquiries(data);
        setLoading(false);
    };

    const markAsContacted = (id: string) => {
        const updated = [...contactedIds, id];
        setContactedIds(updated);
        localStorage.setItem("contacted_enquiry_ids", JSON.stringify(updated));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold font-display text-gray-900 mb-8">Enquiries</h1>

            <div className="space-y-4">
                {loading ? (
                    <p>Loading enquiries...</p>
                ) : enquiries.length === 0 ? (
                    <p className="text-gray-500">No enquiries yet.</p>
                ) : (
                    enquiries.map((enquiry) => {
                        const isNew = !contactedIds.includes(enquiry.id);
                        return (
                            <div key={enquiry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{enquiry.name}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <a href={`mailto:${enquiry.email}`} className="flex items-center gap-1 hover:text-primary">
                                                <Mail className="w-3 h-3" /> {enquiry.email}
                                            </a>
                                            {enquiry.phone && (
                                                <a href={`tel:${enquiry.phone}`} className="flex items-center gap-1 hover:text-primary">
                                                    <Phone className="w-3 h-3" /> {enquiry.phone}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${isNew ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {isNew ? 'NEW' : 'CONTACTED'}
                                        </span>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {new Date(enquiry.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                {enquiry.property_title && (
                                    <div className="bg-gray-50 p-3 rounded-lg mb-4 text-sm">
                                        <strong>Interested in:</strong> {enquiry.property_title}
                                    </div>
                                )}

                                <p className="text-gray-700">{enquiry.message || "No message provided."}</p>

                                {isNew && (
                                    <div className="mt-4 pt-4 border-t">
                                        <Button size="sm" variant="outline" onClick={() => markAsContacted(enquiry.id)}>
                                            Mark as Contacted
                                        </Button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default AdminEnquiries;
