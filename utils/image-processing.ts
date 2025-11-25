/**
 * Resizes and compresses an image file on the client side.
 * 
 * @param file - The original image file.
 * @param maxDimension - The maximum width or height in pixels (default: 2000).
 * @param quality - The JPEG quality between 0 and 1 (default: 0.8).
 * @returns A Promise that resolves to the processed File.
 */
export async function processImage(file: File, maxDimension: number = 2000, quality: number = 0.8): Promise<File> {
    return new Promise((resolve, reject) => {
        // 1. Create an image element to load the file
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            // 2. Calculate new dimensions
            let width = img.width;
            let height = img.height;

            if (width > maxDimension || height > maxDimension) {
                if (width > height) {
                    height = Math.round((height * maxDimension) / width);
                    width = maxDimension;
                } else {
                    width = Math.round((width * maxDimension) / height);
                    height = maxDimension;
                }
            }

            // 3. Create canvas and draw resized image
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            if (!ctx) {
                URL.revokeObjectURL(url);
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Use better interpolation for resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            // 4. Export as JPEG
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) {
                        // Create a new File object with the same name but .jpg extension
                        const newName = file.name.replace(/\.[^/.]+$/, "") + ".jpg";
                        const newFile = new File([blob], newName, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(newFile);
                    } else {
                        reject(new Error('Image processing failed'));
                    }
                },
                'image/jpeg',
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}
