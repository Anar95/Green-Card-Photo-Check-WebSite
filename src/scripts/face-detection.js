/**
 * Face Detection Module
 * Handles human face detection and validation using face-api.js
 */

class FaceDetectionService {
    constructor(languageManager = null) {
        this.isLoaded = false;
        this.isLoading = false;
        this.faceApiLoaded = false;
        this.languageManager = languageManager;
        
        this.init();
    }

    async init() {
        if (this.isLoading) return;
        this.isLoading = true;

        try {
            // Check if face-api.js is available
            if (typeof faceapi !== 'undefined') {
                await this.loadFaceApiModels();
                this.faceApiLoaded = true;
                console.log('Face-api.js loaded successfully');
            } else {
                console.warn('Face-api.js not available, using fallback detection');
            }
        } catch (error) {
            console.warn('Face detection initialization failed:', error);
        }

        this.isLoaded = true;
        this.isLoading = false;
    }

    async loadFaceApiModels() {
        try {
            const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/';
            
            await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
            await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
            await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
            
            console.log('Face detection models loaded');
        } catch (error) {
            console.warn('Failed to load face detection models:', error);
            throw error;
        }
    }

    async detectFace(imageElement) {
        if (!this.isLoaded) {
            await this.init();
        }

        try {
            if (this.faceApiLoaded) {
                return await this.detectFaceWithAPI(imageElement);
            } else {
                return this.detectFaceBasic(imageElement);
            }
        } catch (error) {
            console.warn('Face detection error, using fallback:', error);
            return this.detectFaceBasic(imageElement);
        }
    }

    async detectFaceWithAPI(imageElement) {
        try {
            const detections = await faceapi.detectAllFaces(
                imageElement, 
                new faceapi.TinyFaceDetectorOptions({
                    inputSize: 512,
                    scoreThreshold: 0.3
                })
            );

            if (detections.length === 0) {
                return {
                    hasFace: false,
                    faceCount: 0,
                    message: 'Bu resimde insan yüzü tespit edilemedi. Lütfen yüzünüzün net göründüğü bir fotoğraf yükleyin.',
                    confidence: 0,
                    method: 'face-api'
                };
            }

            if (detections.length > 1) {
                return {
                    hasFace: false,
                    faceCount: detections.length,
                    message: `Resimde ${detections.length} yüz tespit edildi. Green Card fotoğrafında sadece bir kişi olmalıdır.`,
                    confidence: detections[0].score,
                    method: 'face-api'
                };
            }

            const detection = detections[0];
            const faceArea = detection.box.width * detection.box.height;
            const imageArea = imageElement.naturalWidth * imageElement.naturalHeight;
            const faceRatio = faceArea / imageArea;

            // Check face size
            if (faceRatio < 0.015) {
                return {
                    hasFace: false,
                    faceCount: 1,
                    faceSize: 'too_small',
                    faceRatio: faceRatio,
                    message: 'Yüz çok küçük görünüyor. Lütfen kameraya daha yakın bir fotoğraf çekin.',
                    confidence: detection.score,
                    method: 'face-api'
                };
            }

            if (faceRatio > 0.6) {
                return {
                    hasFace: false,
                    faceCount: 1,
                    faceSize: 'too_large',
                    faceRatio: faceRatio,
                    message: 'Yüz çok büyük görünüyor. Lütfen kameradan biraz uzaklaşın.',
                    confidence: detection.score,
                    method: 'face-api'
                };
            }

            // Successful detection
            return {
                hasFace: true,
                faceCount: 1,
                faceBox: detection.box,
                faceSize: 'good',
                faceRatio: faceRatio,
                confidence: detection.score,
                message: 'Mükemmel! İnsan yüzü başarıyla tespit edildi.',
                method: 'face-api'
            };

        } catch (error) {
            console.warn('Face API detection failed:', error);
            return this.detectFaceBasic(imageElement);
        }
    }

    detectFaceBasic(imageElement) {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Scale down for analysis but keep more detail
            const analysisSize = 200; // Increased from 100
            canvas.width = analysisSize;
            canvas.height = analysisSize;
            
            ctx.drawImage(imageElement, 0, 0, analysisSize, analysisSize);
            const imageData = ctx.getImageData(0, 0, analysisSize, analysisSize);
            const data = imageData.data;

            let skinPixels = 0;
            let totalPixels = 0;
            let edgeVariance = 0;
            let centerSkinPixels = 0; // Focus on center area where face would be

            // Basic skin tone and edge detection
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                
                const pixelIndex = i / 4;
                const x = pixelIndex % analysisSize;
                const y = Math.floor(pixelIndex / analysisSize);
                
                totalPixels++;

                // Basic skin tone detection - improved algorithm
                if (this.isSkinToneImproved(r, g, b)) {
                    skinPixels++;
                    
                    // Check if in center area (where face would likely be)
                    if (x > analysisSize * 0.25 && x < analysisSize * 0.75 && 
                        y > analysisSize * 0.25 && y < analysisSize * 0.75) {
                        centerSkinPixels++;
                    }
                }

                // Edge detection for facial features
                if (i < data.length - 4) {
                    const nextR = data[i + 4];
                    edgeVariance += Math.abs(r - nextR);
                }
            }

            const skinRatio = skinPixels / totalPixels;
            const centerSkinRatio = centerSkinPixels / (totalPixels * 0.25); // Center area is 25% of total
            const avgEdgeVariance = edgeVariance / totalPixels;

            console.log('Basic face detection stats:', {
                skinRatio,
                centerSkinRatio,
                avgEdgeVariance,
                totalPixels
            });

            // More lenient thresholds for face detection
            // Only reject if both ratios are extremely low
            if (skinRatio < 0.005 && centerSkinRatio < 0.01) { // Made even more lenient
                return {
                    hasFace: false,
                    faceCount: 0,
                    skinRatio: skinRatio,
                    centerSkinRatio: centerSkinRatio,
                    edgeVariance: avgEdgeVariance,
                    message: this.languageManager ? this.languageManager.t('faceNotDetectedMsg') : 'Bu resimde insan yüzü tespit edilemedi. Lütfen net bir portre fotoğrafı yükleyin.',
                    confidence: Math.max(skinRatio, centerSkinRatio),
                    method: 'basic'
                };
            }

            // Check for reasonable face size - more lenient
            if (skinRatio > 0.8) { // Increased from 0.6 to 0.8
                return {
                    hasFace: false,
                    faceCount: 0,
                    skinRatio: skinRatio,
                    centerSkinRatio: centerSkinRatio,
                    edgeVariance: avgEdgeVariance,
                    message: this.languageManager ? this.languageManager.t('faceTooCloseMsg') : 'Fotoğraf çok yakın çekilmiş olabilir. Lütfen daha uzaktan çekilen bir fotoğraf deneyin.',
                    confidence: skinRatio,
                    method: 'basic'
                };
            }

            // Check for sufficient detail (edges) - very lenient now
            if (avgEdgeVariance < 1) { // Further lowered from 2 to 1
                return {
                    hasFace: false,
                    faceCount: 0,
                    skinRatio: skinRatio,
                    centerSkinRatio: centerSkinRatio,
                    edgeVariance: avgEdgeVariance,
                    message: this.languageManager ? this.languageManager.t('faceBlurryMsg') : 'Fotoğraf çok bulanık veya düşük kaliteli. Daha net bir fotoğraf yükleyin.',
                    confidence: skinRatio,
                    method: 'basic'
                };
            }

            // Success case
            return {
                hasFace: true,
                faceCount: 1,
                skinRatio: skinRatio,
                centerSkinRatio: centerSkinRatio,
                edgeVariance: avgEdgeVariance,
                message: this.languageManager ? this.languageManager.t('faceDetectedSuccess') : 'İnsan yüzü tespit edildi (temel analiz).',
                confidence: Math.max(skinRatio, centerSkinRatio * 2), // Weight center area more
                method: 'basic'
            };

        } catch (error) {
            console.error('Basic face detection failed:', error);
            return {
                hasFace: true, // Don't block user if analysis fails
                faceCount: 1,
                message: this.languageManager ? this.languageManager.t('faceAnalysisFailedMsg') : 'Yüz analizi yapılamadı, manuel kontrol önerilir.',
                confidence: 0.5,
                method: 'fallback',
                error: error.message
            };
        }
    }

    isSkinTone(r, g, b) {
        // Basic skin tone detection algorithm
        // This is a simplified version and may not be accurate for all skin tones
        return (
            r > 95 && g > 40 && b > 20 &&
            Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
            Math.abs(r - g) > 15 && 
            r > g && r > b
        ) || (
            // Alternative skin tone range
            r > 220 && g > 210 && b > 170 &&
            Math.abs(r - g) <= 15 && r >= g && g >= b
        );
    }

    isSkinToneImproved(r, g, b) {
        // More comprehensive skin tone detection for different ethnicities
        // Based on research papers on skin color detection in RGB color space
        
        // Rule 1: Standard caucasian skin range
        const rule1 = (r > 95 && g > 40 && b > 20 &&
                      Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
                      Math.abs(r - g) > 15 && r > g && r > b);
        
        // Rule 2: Light skin tones
        const rule2 = (r > 220 && g > 210 && b > 170 &&
                      Math.abs(r - g) <= 15 && r >= g && g >= b);
        
        // Rule 3: Broader range for darker skin tones
        const rule3 = (r >= 60 && g >= 40 && b >= 20 &&
                      r >= 1.15 * g && r > b &&
                      r + g + b >= 80);
        
        // Rule 4: Medium skin tones
        const rule4 = (r > 80 && g > 50 && b > 30 &&
                      r > g && g > b &&
                      (r - g) >= 10 && (g - b) >= 5);
        
        // Rule 5: Asian skin tones
        const rule5 = (r > 120 && g > 80 && b > 50 &&
                      Math.abs(r - g) < 50 &&
                      r >= g && g >= b);
        
        // Rule 6: Very basic luminance check
        const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
        const rule6 = (luminance > 50 && luminance < 230 &&
                      r > g * 0.8 && r > b * 0.8);
        
        return rule1 || rule2 || rule3 || rule4 || rule5 || rule6;
    }

    // Face position analysis
    analyzeFacePosition(faceBox, imageWidth, imageHeight) {
        if (!faceBox) return { centered: false, message: 'Yüz kutusu bulunamadı' };

        const faceCenterX = faceBox.x + faceBox.width / 2;
        const faceCenterY = faceBox.y + faceBox.height / 2;
        
        const imageCenterX = imageWidth / 2;
        const imageCenterY = imageHeight / 2;

        const offsetX = Math.abs(faceCenterX - imageCenterX) / imageWidth;
        const offsetY = Math.abs(faceCenterY - imageCenterY) / imageHeight;

        const isCentered = offsetX < 0.15 && offsetY < 0.15;

        return {
            centered: isCentered,
            offsetX: offsetX,
            offsetY: offsetY,
            message: isCentered ? 
                'Yüz iyi konumlanmış' : 
                'Yüz tam merkezde değil, düzeltme önerilir'
        };
    }

    // Eye level analysis
    analyzeEyeLevel(faceBox, imageHeight) {
        if (!faceBox) return { correct: false, message: 'Yüz kutusu bulunamadı' };

        const eyeLevel = faceBox.y + (faceBox.height * 0.3); // Approximate eye position
        const idealEyeLevel = imageHeight * 0.6; // Eyes should be at 60% from top
        
        const deviation = Math.abs(eyeLevel - idealEyeLevel) / imageHeight;
        const isCorrect = deviation < 0.1;

        return {
            correct: isCorrect,
            eyeLevel: eyeLevel,
            idealLevel: idealEyeLevel,
            deviation: deviation,
            message: isCorrect ? 
                'Göz seviyesi uygun' : 
                'Göz seviyesi ayarlanmalı'
        };
    }

    // Head size analysis
    analyzeHeadSize(faceBox, imageHeight) {
        if (!faceBox) return { correct: false, message: 'Yüz kutusu bulunamadı' };

        const headHeightRatio = faceBox.height / imageHeight;
        const isCorrect = headHeightRatio >= 0.5 && headHeightRatio <= 0.7;

        return {
            correct: isCorrect,
            headHeightRatio: headHeightRatio,
            message: isCorrect ? 
                'Baş boyutu uygun' : 
                headHeightRatio < 0.5 ? 'Baş çok küçük' : 'Baş çok büyük'
        };
    }

    // Get comprehensive face analysis
    async getComprehensiveAnalysis(imageElement) {
        const faceDetection = await this.detectFace(imageElement);
        
        if (!faceDetection.hasFace) {
            return {
                isValid: false,
                issues: [faceDetection.message],
                detection: faceDetection
            };
        }

        const issues = [];
        const analysis = { detection: faceDetection };

        // Analyze face position if we have face box data
        if (faceDetection.faceBox) {
            const positionAnalysis = this.analyzeFacePosition(
                faceDetection.faceBox, 
                imageElement.naturalWidth, 
                imageElement.naturalHeight
            );
            analysis.position = positionAnalysis;
            
            if (!positionAnalysis.centered) {
                issues.push(positionAnalysis.message);
            }

            // Analyze eye level
            const eyeLevelAnalysis = this.analyzeEyeLevel(
                faceDetection.faceBox, 
                imageElement.naturalHeight
            );
            analysis.eyeLevel = eyeLevelAnalysis;
            
            if (!eyeLevelAnalysis.correct) {
                issues.push(eyeLevelAnalysis.message);
            }

            // Analyze head size
            const headSizeAnalysis = this.analyzeHeadSize(
                faceDetection.faceBox, 
                imageElement.naturalHeight
            );
            analysis.headSize = headSizeAnalysis;
            
            if (!headSizeAnalysis.correct) {
                issues.push(headSizeAnalysis.message);
            }
        }

        return {
            isValid: issues.length === 0,
            issues: issues,
            ...analysis
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FaceDetectionService;
} else if (typeof window !== 'undefined') {
    window.FaceDetectionService = FaceDetectionService;
}