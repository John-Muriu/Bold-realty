
import { useState } from "react";
import imageCompression from "browser-image-compression";
import { supabase } from "@/integrations/supabase/client";

interface UploadState {
    progress: number;
    isUploading: boolean;
    error: string | null;
}

export const useImageUpload = () => {
    const [uploadState, setUploadState] = useState<UploadState>({
        progress: 0,
        isUploading: false,
        error: null,
    });

    const processImage = async (file: File): Promise<string> => {
        // 1. Validate file type
        if (!file.type.match(/^image\/(png|jpeg|jpg)$/i)) {
            throw new Error(`File ${file.name} is not a supported image format (PNG/JPEG only).`);
        }

        // 2. Compress and convert to WebP
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: "image/webp",
        };

        const compressedFile = await imageCompression(file, options);

        // 3. Rename file
        // 3. Rename file
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        // Add random suffix for uniqueness
        const randomSuffix = Math.random().toString(36).substring(2, 8);

        const fileName = `ivorycrest-${year}${month}${day}-${hours}${minutes}${seconds}-${randomSuffix}.webp`;

        // 4. Upload to Supabase
        const { error: uploadError } = await supabase.storage
            .from("images")
            .upload(fileName, compressedFile, {
                contentType: "image/webp",
                upsert: false,
            });

        if (uploadError) {
            throw uploadError;
        }

        // 5. Get Public URL
        const { data: publicUrlData } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);

        return publicUrlData.publicUrl;
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        setUploadState({ progress: 0, isUploading: true, error: null });

        try {
            setUploadState((prev) => ({ ...prev, progress: 10 }));
            const url = await processImage(file);
            setUploadState({ progress: 100, isUploading: false, error: null });
            return url;
        } catch (error: any) {
            console.error("Upload error:", error);
            setUploadState({
                progress: 0,
                isUploading: false,
                error: error.message || "An error occurred during upload.",
            });
            return null;
        }
    };

    const uploadImages = async (files: File[]): Promise<string[]> => {
        setUploadState({ progress: 0, isUploading: true, error: null });
        const urls: string[] = [];
        const totalFiles = files.length;
        let completed = 0;

        try {
            for (const file of files) {
                try {
                    const url = await processImage(file);
                    urls.push(url);
                } catch (err: any) {
                    console.error(`Failed to upload ${file.name}:`, err);
                    throw err;
                }
                completed++;
                setUploadState((prev) => ({ ...prev, progress: (completed / totalFiles) * 100 }));
            }

            setUploadState({ progress: 100, isUploading: false, error: null });
            return urls;
        } catch (error: any) {
            console.error("Batch upload error:", error);

            let errorMessage = error.message || "An error occurred during batch upload.";
            if (error.message?.includes("Bucket not found")) {
                errorMessage = "Storage bucket 'images' not found. Please create a public bucket named 'images' in your Supabase dashboard.";
            }

            setUploadState({
                progress: (completed / totalFiles) * 100,
                isUploading: false,
                error: errorMessage,
            });
            // Re-throw to allow component to handle or display specific toast
            throw new Error(errorMessage);
        }
    };

    return { ...uploadState, uploadImage, uploadImages };
};
