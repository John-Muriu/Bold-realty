
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Loader2 } from "lucide-react";
import { watermarkImage } from "@/lib/watermark";
import { useImageUpload } from "@/hooks/useImageUpload";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ImageUploadProps {
    onImagesUploaded: (urls: string[]) => void;
    existingImages?: string[];
    maxImages?: number;
}

const ImageUpload = ({ onImagesUploaded, existingImages = [], maxImages = 10 }: ImageUploadProps) => {
    const [watermarking, setWatermarking] = useState(false);
    const [previews, setPreviews] = useState<string[]>(existingImages);
    const { uploadImages, isUploading, progress } = useImageUpload();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (previews.length + acceptedFiles.length > maxImages) {
            toast.error(`You can only upload up to ${maxImages} images.`);
            return;
        }

        setWatermarking(true);

        try {
            const filesToUpload: File[] = [];

            // 1. Watermark images
            for (const file of acceptedFiles) {
                try {
                    const watermarkedBlob = await watermarkImage(file);
                    // Create a new File from the blob, keeping the original name but ensuring correct type
                    // We pass it to the hook which will convert to WebP anyway
                    const watermarkedFile = new File([watermarkedBlob], file.name, { type: "image/jpeg" });
                    filesToUpload.push(watermarkedFile);
                } catch (err) {
                    console.error("Watermarking failed for", file.name, err);
                    toast.error(`Failed to process ${file.name}`);
                }
            }

            setWatermarking(false);

            if (filesToUpload.length > 0) {
                // 2. Upload using the hook (handles compression, WebP conversion, renaming)
                const newUrls = await uploadImages(filesToUpload);

                if (newUrls.length > 0) {
                    const updatedImages = [...previews, ...newUrls];
                    setPreviews(updatedImages);
                    onImagesUploaded(updatedImages);
                    toast.success("Images uploaded successfully!");
                }
            }
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images. Please try again.");
            setWatermarking(false);
        }
    }, [previews, maxImages, onImagesUploaded, uploadImages]);

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
        disabled: watermarking || isUploading
    });

    return (
        <div className="space-y-4">
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary"
                    } ${(watermarking || isUploading) ? "opacity-50 cursor-not-allowed" : ""}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                    {watermarking || isUploading ? (
                        <div className="w-full max-w-xs space-y-2">
                            <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                            <p className="font-medium text-gray-600">
                                {watermarking ? "Watermarking Images..." : "Compressing & Uploading..."}
                            </p>
                            {isUploading && (
                                <Progress value={progress} className="h-2 w-full" />
                            )}
                        </div>
                    ) : (
                        <>
                            <Upload className="w-10 h-10 text-gray-400" />
                            <p className="font-medium text-gray-600">
                                Drag & drop images here, or click to select
                            </p>
                        </>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
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
