import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { watermarkImage } from "@/lib/watermark";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
    onImagesUploaded: (urls: string[]) => void;
    existingImages?: string[];
    maxImages?: number;
}

const ImageUpload = ({ onImagesUploaded, existingImages = [], maxImages = 10 }: ImageUploadProps) => {
    const [uploading, setUploading] = useState(false);
    const [previews, setPreviews] = useState<string[]>(existingImages);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (previews.length + acceptedFiles.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images.`);
            return;
        }

        setUploading(true);
        const newUrls: string[] = [];

        try {
            for (const file of acceptedFiles) {
                // 1. Watermark the image
                const watermarkedBlob = await watermarkImage(file);

                // 2. Upload to Supabase
                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`;
                const { data, error } = await supabase.storage
                    .from("property-images")
                    .upload(fileName, watermarkedBlob, {
                        contentType: "image/jpeg",
                        upsert: false
                    });

                if (error) throw error;

                // 3. Get Public URL
                const { data: { publicUrl } } = supabase.storage
                    .from("property-images")
                    .getPublicUrl(fileName);

                newUrls.push(publicUrl);
            }

            const updatedImages = [...previews, ...newUrls];
            setPreviews(updatedImages);
            onImagesUploaded(updatedImages);
            toast.success("Images uploaded and watermarked successfully!");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images. Please try again.");
        } finally {
            setUploading(false);
        }
    }, [previews, maxImages, onImagesUploaded]);

    const removeImage = (indexToRemove: number) => {
        const updatedImages = previews.filter((_, index) => index !== indexToRemove);
        setPreviews(updatedImages);
        onImagesUploaded(updatedImages);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        disabled: uploading
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                    } ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    {uploading ? (
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    ) : (
                        <Upload className="w-10 h-10 text-gray-400" />
                    )}
                    <p className="font-medium text-gray-600">
                        {uploading ? "Processing & Watermarking..." : "Drag & drop images here, or click to select"}
                    </p>
                    <p className="text-xs text-gray-400">
                        Supports: JPG, PNG, WEBP (Max {maxImages} images)
                    </p>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {previews.map((url, index) => (
                        <div key={url} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200">
                            <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
