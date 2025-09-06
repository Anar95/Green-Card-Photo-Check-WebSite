/**
 * Image Processing Module
 * Handles image analysis, validation, and automatic corrections for Green Card photos
 */

class ImageProcessor {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.originalImage = null;
        this.processedImage = null;
        
        this.init();
    }
    

    init() {
        // Create processing canvas
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
    }

    // Load image from file
    loadImageFromFile(file) {
        return new Promise((resolve, reject) => {
            if (!file.type.startsWith('image/')) {
                reject(new Error('Selected file is not an image'));
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    this.originalImage = img;
                    resolve(img);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }

    // Comprehensive image analysis
    analyzeImage(image, file = null) {
        const results = [];

        // 1. Aspect Ratio Check
        const aspectRatio = image.naturalWidth / image.naturalHeight;
        const isSquare = Math.abs(aspectRatio - 1) < 0.1;
        results.push({
            check: 'aspectRatio',
            title: 'Kare format (1:1 nisbət)',
            status: isSquare ? 'pass' : 'fail',
            value: aspectRatio.toFixed(2),
            message: isSquare ? 
                '✓ Kare format' : 
                `❌ ${aspectRatio.toFixed(2)}:1 oranı (1:1 olmalı)`,
            critical: !isSquare
        });

        // 2. Resolution Check
        const minResolution = 600;
        const hasGoodResolution = image.naturalWidth >= minResolution && image.naturalHeight >= minResolution;
        results.push({
            check: 'resolution',
            title: 'Minimum çözünürlük (600x600)',
            status: hasGoodResolution ? 'pass' : 'fail',
            value: `${image.naturalWidth}x${image.naturalHeight}`,
            message: hasGoodResolution ? 
                `✓ ${image.naturalWidth}x${image.naturalHeight} piksel` : 
                `❌ ${image.naturalWidth}x${image.naturalHeight} piksel (min 600x600)`,
            critical: !hasGoodResolution
        });

        // 3. File-based checks
        if (file) {
            // File size checks
            const fileSizeKB = file.size / 1024;
            const maxSizeOK = fileSizeKB <= 240;
            const minSizeOK = fileSizeKB >= 54;
            
            results.push({
                check: 'maxFileSize',
                title: 'Maksimum dosya boyutu (240 KB)',
                status: maxSizeOK ? 'pass' : 'fail',
                value: `${fileSizeKB.toFixed(1)} KB`,
                message: maxSizeOK ? 
                    `✓ ${fileSizeKB.toFixed(1)} KB` : 
                    `❌ ${fileSizeKB.toFixed(1)} KB (max 240 KB)`,
                critical: !maxSizeOK
            });

            results.push({
                check: 'minFileSize',
                title: 'Minimum dosya boyutu (54 KB)',
                status: minSizeOK ? 'pass' : 'fail',
                value: `${fileSizeKB.toFixed(1)} KB`,
                message: minSizeOK ? 
                    `✓ ${fileSizeKB.toFixed(1)} KB` : 
                    `❌ ${fileSizeKB.toFixed(1)} KB (min 54 KB)`,
                critical: !minSizeOK
            });

            // Format check
            const isJPEG = file.type === 'image/jpeg' || file.type === 'image/jpg';
            results.push({
                check: 'format',
                title: 'JPEG formatı',
                status: isJPEG ? 'pass' : 'fail',
                value: file.type,
                message: isJPEG ? 
                    '✓ JPEG format' : 
                    `❌ ${file.type} (JPEG gerekli)`,
                critical: !isJPEG
            });
        }

        // 4. Color Analysis
        const colorAnalysis = this.analyzeImageColor(image);
        results.push({
            check: 'colorImage',
            title: 'Renkli görüntü',
            status: colorAnalysis.isColor ? 'pass' : 'warning',
            value: colorAnalysis.variance.toFixed(1),
            message: colorAnalysis.isColor ? 
                '✓ Renkli görüntü' : 
                '⚠️ Renk kontrolü gerekli',
            critical: false
        });

        // 5. Background Analysis
        const bgAnalysis = this.analyzeBackground(image);
        results.push({
            check: 'background',
            title: 'Beyaz arka plan',
            status: bgAnalysis.isWhite ? 'pass' : 'warning',
            value: `RGB(${bgAnalysis.avgR}, ${bgAnalysis.avgG}, ${bgAnalysis.avgB})`,
            message: bgAnalysis.isWhite ? 
                '✓ Beyaz arka plan' : 
                '⚠️ Arka plan kontrolü gerekli',
            critical: false
        });

        // 6. Sharpness Analysis
        const sharpnessAnalysis = this.analyzeSharpness(image);
        results.push({
            check: 'sharpness',
            title: 'Görüntü netliği',
            status: sharpnessAnalysis.isSharp ? 'pass' : 'warning',
            value: sharpnessAnalysis.variance.toFixed(1),
            message: sharpnessAnalysis.isSharp ? 
                '✓ Net görüntü' : 
                '⚠️ Görüntü daha net olmalı',
            critical: false
        });

        // 7. Head Size Estimation
        const headSizeAnalysis = this.estimateHeadSize(image);
        results.push({
            check: 'headSize',
            title: 'Baş ölçüsü (22-35mm arası)',
            status: headSizeAnalysis.isCorrect ? 'pass' : 'warning',
            value: `~${headSizeAnalysis.estimated}mm`,
            message: headSizeAnalysis.isCorrect ? 
                `✓ Baş ölçüsü: ~${headSizeAnalysis.estimated}mm` : 
                `⚠️ Baş ölçüsü uygun değil (~${headSizeAnalysis.estimated}mm)`,
            critical: false
        });

        return this.categorizeResults(results);
    }

    // Analyze image color variance
    analyzeImageColor(image) {
        this.setupTempCanvas(image, 100, 100);
        const imageData = this.ctx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        
        let colorVariance = 0;
        let sampleCount = 0;

        for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calculate color variance
            const variance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            colorVariance += variance;
            sampleCount++;
        }

        const avgVariance = colorVariance / sampleCount;
        return { 
            isColor: avgVariance > 10, 
            variance: avgVariance 
        };
    }

    // Analyze background color
    analyzeBackground(image) {
        this.setupTempCanvas(image);
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const data = imageData.data;
        
        let totalR = 0, totalG = 0, totalB = 0;
        let sampleCount = 0;

        // Sample edge pixels for background color
        const width = this.canvas.width;
        const height = this.canvas.height;

        // Top and bottom edges
        for (let x = 0; x < width; x += 10) {
            // Top edge
            let idx = (0 * width + x) * 4;
            if (idx < data.length) {
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                sampleCount++;
            }

            // Bottom edge
            idx = ((height - 1) * width + x) * 4;
            if (idx < data.length) {
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                sampleCount++;
            }
        }

        // Left and right edges
        for (let y = 0; y < height; y += 10) {
            // Left edge
            let idx = (y * width + 0) * 4;
            if (idx < data.length) {
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                sampleCount++;
            }

            // Right edge
            idx = (y * width + (width - 1)) * 4;
            if (idx < data.length) {
                totalR += data[idx];
                totalG += data[idx + 1];
                totalB += data[idx + 2];
                sampleCount++;
            }
        }

        const avgR = totalR / sampleCount;
        const avgG = totalG / sampleCount;
        const avgB = totalB / sampleCount;

        // Check if background is close to white
        const isWhite = avgR > 200 && avgG > 200 && avgB > 200;

        return { isWhite, avgR: Math.round(avgR), avgG: Math.round(avgG), avgB: Math.round(avgB) };
    }

    // Analyze image sharpness
    analyzeSharpness(image) {
        this.setupTempCanvas(image, 200, 200);
        const imageData = this.ctx.getImageData(0, 0, 200, 200);
        const data = imageData.data;
        
        let variance = 0;
        let count = 0;

        // Calculate edge variance (Laplacian)
        for (let y = 1; y < 199; y++) {
            for (let x = 1; x < 199; x++) {
                const idx = (y * 200 + x) * 4;
                const center = data[idx];
                
                const top = data[((y-1) * 200 + x) * 4];
                const bottom = data[((y+1) * 200 + x) * 4];
                const left = data[(y * 200 + (x-1)) * 4];
                const right = data[(y * 200 + (x+1)) * 4];
                
                const laplacian = Math.abs(4 * center - top - bottom - left - right);
                variance += laplacian;
                count++;
            }
        }

        const avgVariance = variance / count;
        return { 
            isSharp: avgVariance > 15, 
            variance: avgVariance 
        };
    }

    // Estimate head size in the photo
    estimateHeadSize(image) {
        // Simplified head size estimation
        const imageHeight = image.naturalHeight;
        const estimatedHeadHeight = imageHeight * 0.6; // Approximate head size
        const headSizeMM = (estimatedHeadHeight / imageHeight) * 51; // Convert to mm for 2x2 inch
        
        return {
            isCorrect: headSizeMM >= 22 && headSizeMM <= 35,
            estimated: Math.round(headSizeMM)
        };
    }

    // Setup temporary canvas for analysis
    setupTempCanvas(image, width = null, height = null) {
        if (width && height) {
            this.canvas.width = width;
            this.canvas.height = height;
        } else {
            this.canvas.width = image.naturalWidth;
            this.canvas.height = image.naturalHeight;
        }
        
        this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
    }

    // Categorize analysis results
    categorizeResults(results) {
        const criticalFailures = results.filter(r => r.critical && r.status === 'fail');
        const failures = results.filter(r => r.status === 'fail');
        const warnings = results.filter(r => r.status === 'warning');
        const passes = results.filter(r => r.status === 'pass');

        return {
            results,
            summary: {
                total: results.length,
                critical: criticalFailures.length,
                failures: failures.length,
                warnings: warnings.length,
                passes: passes.length
            },
            hasCriticalIssues: criticalFailures.length > 0,
            hasFailures: failures.length > 0,
            hasWarnings: warnings.length > 0,
            isValid: criticalFailures.length === 0 && failures.length === 0
        };
    }

    // Fix image automatically
    fixImage(image, targetSize = 600) {
        const fixedCanvas = document.createElement('canvas');
        const fixedCtx = fixedCanvas.getContext('2d');
        
        // Set target size (square format)
        const finalSize = Math.max(targetSize, Math.max(image.naturalWidth, image.naturalHeight));
        fixedCanvas.width = finalSize;
        fixedCanvas.height = finalSize;
        
        // Fill with white background
        fixedCtx.fillStyle = 'white';
        fixedCtx.fillRect(0, 0, finalSize, finalSize);
        
        // Calculate scaling and positioning to fit the image
        const scale = Math.min(finalSize * 0.95 / image.naturalWidth, finalSize * 0.95 / image.naturalHeight);
        const scaledWidth = image.naturalWidth * scale;
        const scaledHeight = image.naturalHeight * scale;
        const x = (finalSize - scaledWidth) / 2;
        const y = (finalSize - scaledHeight) / 2;
        
        // Draw the image centered
        fixedCtx.drawImage(image, x, y, scaledWidth, scaledHeight);
        
        // Apply brightness and contrast adjustments if needed
        this.enhanceImage(fixedCtx, finalSize, finalSize);
        
        this.processedImage = fixedCanvas;
        return fixedCanvas;
    }

    // Enhance image brightness and contrast
    enhanceImage(ctx, width, height) {
        try {
            const imageData = ctx.getImageData(0, 0, width, height);
            const data = imageData.data;
            
            // Calculate average brightness
            let totalBrightness = 0;
            for (let i = 0; i < data.length; i += 4) {
                const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
                totalBrightness += brightness;
            }
            
            const avgBrightness = totalBrightness / (data.length / 4);
            
            // Adjust only if image is too dark
            if (avgBrightness < 120) {
                const brightnessAdjustment = 1.2;
                const contrastAdjustment = 1.1;
                
                for (let i = 0; i < data.length; i += 4) {
                    // Apply brightness and contrast
                    data[i] = Math.min(255, data[i] * brightnessAdjustment * contrastAdjustment);     // R
                    data[i + 1] = Math.min(255, data[i + 1] * brightnessAdjustment * contrastAdjustment); // G
                    data[i + 2] = Math.min(255, data[i + 2] * brightnessAdjustment * contrastAdjustment); // B
                }
                
                ctx.putImageData(imageData, 0, 0);
            }
        } catch (error) {
            console.warn('Image enhancement failed:', error);
        }
    }

    // Convert canvas to blob for download
    canvasToBlob(canvas, quality = 0.95) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, 'image/jpeg', quality);
        });
    }

    // Create download link
    createDownloadLink(canvas, filename = 'green-card-photo.jpg') {
        const url = canvas.toDataURL('image/jpeg', 0.95);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        return a;
    }

    // Download processed image
    async downloadImage(canvas = null, filename = 'green-card-photo.jpg') {
        const targetCanvas = canvas || this.processedImage;
        if (!targetCanvas) {
            throw new Error('No processed image available for download');
        }

        // Create final canvas with exact Green Card dimensions
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        
        // 2x2 inches at 300 DPI = 600x600 pixels
        const finalSize = 600;
        finalCanvas.width = finalSize;
        finalCanvas.height = finalSize;
        
        // Draw the processed image
        finalCtx.drawImage(targetCanvas, 0, 0, finalSize, finalSize);
        
        // Download
        const blob = await this.canvasToBlob(finalCanvas, 0.95);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        return blob;
    }

    // Get processed image data URL
    getProcessedImageDataURL(quality = 0.95) {
        if (!this.processedImage) {
            throw new Error('No processed image available');
        }
        return this.processedImage.toDataURL('image/jpeg', quality);
    }

    // Reset processor state
    reset() {
        this.originalImage = null;
        this.processedImage = null;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageProcessor;
} else if (typeof window !== 'undefined') {
    window.ImageProcessor = ImageProcessor;
}