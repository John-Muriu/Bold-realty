export const watermarkImage = async (file: File, logoUrl: string = "/ivory-crest-logo.png"): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
            const img = new Image();
            img.src = e.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }

                // Resize image if too large (Max 1920px width) - helps performance
                const MAX_WIDTH = 1920;
                let width = img.width;
                let height = img.height;

                if (width > MAX_WIDTH) {
                    height = (height * MAX_WIDTH) / width;
                    width = MAX_WIDTH;
                }

                canvas.width = width;
                canvas.height = height;

                // Draw original image
                ctx.drawImage(img, 0, 0, width, height);

                // Load Logo
                const logo = new Image();
                logo.crossOrigin = "anonymous";
                logo.src = logoUrl;
                logo.onload = () => {
                    // Calculate logo size (e.g., 15% of image width)
                    const logoWidth = width * 0.15;
                    const logoHeight = (logo.height / logo.width) * logoWidth;

                    // Position: Bottom Right with padding
                    const padding = width * 0.02;
                    const x = width - logoWidth - padding;
                    const y = height - logoHeight - padding;

                    // Draw Logo with transparency
                    ctx.globalAlpha = 0.8;
                    ctx.drawImage(logo, x, y, logoWidth, logoHeight);

                    // Convert back to Blob
                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas to Blob failed"));
                    }, "image/jpeg", 0.85); // 85% quality JPEG
                };
                logo.onerror = () => {
                    // Fallback: Return original if logo fails
                    console.warn("Watermark logo failed to load from:", logoUrl);
                    // Try absolute path if relative failed
                    if (logoUrl.startsWith('/')) {
                        const absoluteUrl = window.location.origin + logoUrl;
                        if (logo.src !== absoluteUrl) {
                            console.log("Retrying with absolute URL:", absoluteUrl);
                            logo.src = absoluteUrl;
                            return;
                        }
                    }

                    canvas.toBlob((blob) => {
                        if (blob) resolve(blob);
                        else reject(new Error("Canvas to Blob failed"));
                    }, "image/jpeg", 0.85);
                }
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
};
