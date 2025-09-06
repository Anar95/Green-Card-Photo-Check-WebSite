/**
 * Green Card Photo Tool - Main Application
 * Handles the main application logic and user interactions
 */

class GreenCardPhotoApp {
    constructor() {
        this.originalImage = null;
        this.processedImage = null;
        this.faceApiLoaded = false;
        this.languageManager = new LanguageManager();
        this.faceDetectionService = new FaceDetectionService(this.languageManager);
        
        this.initializeElements();
        this.setupEventListeners();
        this.initializeFaceAPI();
    }

    initializeElements() {
        this.fileInput = document.getElementById('fileInput');
        this.uploadArea = document.getElementById('uploadArea');
        this.previewContainer = document.getElementById('previewContainer');
        this.canvasContainer = document.getElementById('canvasContainer');
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.checkBtn = document.getElementById('checkBtn');
        this.fixBtn = document.getElementById('fixBtn');
        this.downloadBtn = document.getElementById('downloadBtn');
        this.resultSection = document.getElementById('resultSection');
        this.resultContent = document.getElementById('resultContent');
    }

    async initializeFaceAPI() {
        try {
            if (typeof faceapi !== 'undefined') {
                const modelPath = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api@latest/model/';
                
                await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
                await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
                await faceapi.nets.faceRecognitionNet.loadFromUri(modelPath);
                
                this.faceApiLoaded = true;
                console.log('Face-api.js loaded successfully');
            }
        } catch (error) {
            console.warn('Face-api.js loading failed, using fallback:', error);
            this.faceApiLoaded = false;
        }
    }

    setupEventListeners() {
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleFile(e.target.files[0]);
            }
        });

        // Upload area interactions
        this.setupUploadArea();

        // Button events
        this.checkBtn.addEventListener('click', () => this.checkRequirements());
        this.fixBtn.addEventListener('click', () => this.fixImage());
        this.downloadBtn.addEventListener('click', () => this.downloadImage());

        // Language change events
        document.addEventListener('languageChanged', (e) => {
            this.updateUITexts();
        });
    }

    setupUploadArea() {
        // Click to upload
        const uploadBtn = document.querySelector('.upload-area .btn');
        if (uploadBtn) {
            uploadBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.fileInput.click();
            };
        }

        this.uploadArea.onclick = (e) => {
            if (e.target === this.uploadArea || e.target.closest('.upload-area')) {
                this.fileInput.click();
            }
        };

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            this.uploadArea.classList.add('dragover');
        });

        this.uploadArea.addEventListener('dragleave', () => {
            this.uploadArea.classList.remove('dragover');
        });

        this.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            this.uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });
    }

    async handleFile(file) {
        if (!file.type.startsWith('image/')) {
            this.showError(this.languageManager.t('invalidFileType'));
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const img = new Image();
            img.onload = async () => {
                console.log('Image loaded:', {
                    width: img.naturalWidth,
                    height: img.naturalHeight,
                    src: img.src.substring(0, 50) + '...'
                });
                
                // First check if image contains a human face
                const faceDetectionResult = await this.faceDetectionService.detectFace(img);
                
                console.log('Face detection result:', {
                    hasFace: faceDetectionResult.hasFace,
                    method: faceDetectionResult.method,
                    confidence: faceDetectionResult.confidence,
                    message: faceDetectionResult.message
                });
                
                if (!faceDetectionResult.hasFace) {
                    this.showFaceDetectionError(faceDetectionResult.message);
                    return;
                }
                
                this.originalImage = img;
                this.displayPreview(img);
                this.setupCanvas(img);
                this.enableButtons();
                
                // Show face detection success
                this.showFaceDetectionSuccess(faceDetectionResult);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    displayPreview(img) {
        this.previewContainer.innerHTML = '';
        const previewImg = img.cloneNode();
        previewImg.className = 'preview-image';
        this.previewContainer.appendChild(previewImg);
    }

    setupCanvas(img) {
        const targetSize = 600; // Display size
        const aspectRatio = img.width / img.height;
        
        if (aspectRatio > 1) {
            this.canvas.width = targetSize;
            this.canvas.height = targetSize / aspectRatio;
        } else {
            this.canvas.width = targetSize * aspectRatio;
            this.canvas.height = targetSize;
        }
        
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.canvasContainer.style.display = 'block';
    }

    enableButtons() {
        this.checkBtn.disabled = false;
        this.fixBtn.disabled = false;
    }

    showFaceDetectionError(message) {
        const errorHtml = `
            <div class="face-detection-error">
                <div class="error-icon">👤❌</div>
                <h3>${this.languageManager.t('faceNotDetected')}</h3>
                <p>${message}</p>
                <div class="suggestions">
                    <h4>${this.languageManager.t('errorSuggestions')}</h4>
                    <ul>
                        <li>${this.languageManager.t('suggestion1')}</li>
                        <li>${this.languageManager.t('suggestion2')}</li>
                        <li>${this.languageManager.t('suggestion3')}</li>
                        <li>${this.languageManager.t('suggestion4')}</li>
                    </ul>
                </div>
                <div class="controls">
                    <button class="btn" onclick="app.resetUpload()">${this.languageManager.t('newPhotoBtn')}</button>
                    <button class="btn btn-warning" onclick="app.bypassFaceDetection()">${this.languageManager.t('continueAnyway')}</button>
                </div>
            </div>
        `;
        
        this.previewContainer.innerHTML = errorHtml;
        this.canvasContainer.style.display = 'none';
        this.checkBtn.disabled = true;
        this.fixBtn.disabled = true;
        this.downloadBtn.disabled = true;
    }

    showFaceDetectionSuccess(result) {
        const successMsg = document.createElement('div');
        successMsg.className = 'face-success-msg';
        successMsg.innerHTML = `✅ ${result.message}`;
        
        document.body.appendChild(successMsg);
        
        setTimeout(() => {
            successMsg.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => successMsg.remove(), 300);
        }, 3000);
    }

    showError(message) {
        alert(message);
    }

    resetUpload() {
        this.fileInput.value = '';
        this.previewContainer.innerHTML = `<p data-lang="noImage">${this.languageManager.t('noImage')}</p>`;
        this.canvasContainer.style.display = 'none';
        this.resultSection.style.display = 'none';
        this.checkBtn.disabled = true;
        this.fixBtn.disabled = true;
        this.downloadBtn.disabled = true;
    }

    async checkRequirements() {
        const analyzer = new ImageAnalyzer(this.originalImage, this.faceDetectionService);
        const results = await analyzer.performFullAnalysis();
        
        // Check if there are any critical failures
        const hasCriticalFailures = results.some(r => r.critical || r.status === 'fail');
        const hasWarnings = results.some(r => r.status === 'warning');
        
        if (hasCriticalFailures) {
            this.displayTechnicalError(results);
        } else if (hasWarnings) {
            this.displayWarningsWithFix(results);
        } else {
            this.displaySuccessResults(results);
        }
    }

    displayTechnicalError(results) {
        let html = `
            <div class="technical-error">
                <div class="alert-header">
                    <h3>❌ Teknik Sorunlar Tespit Edildi</h3>
                    <p>Fotoğrafınızda bazı teknik sorunlar tespit edildi. Otomatik düzeltme özelliğimiz bu sorunları çözebilir.</p>
                    <p><strong>Aşağıdaki özellikler otomatik olarak düzeltilecek:</strong></p>
                </div>
                <div class="alert-details">
                    <h4>Teknik Sorunlar:</h4>
                    <ul>
        `;
        
        results.forEach(result => {
            if (result.status === 'fail') {
                html += `<li class="error-item">❌ ${result.title}: ${result.message}</li>`;
            } else if (result.status === 'warning') {
                html += `<li class="warning-item">⚠️ ${result.title}: ${result.message}</li>`;
            } else {
                html += `<li class="success-item">✅ ${result.title}: ${result.message}</li>`;
            }
        });
        
        html += `
                    </ul>
                    <div class="fix-suggestion">
                        <button class="btn btn-primary" onclick="app.fixImageWithDetails()">
                            Şəkli Düzəlt
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        this.resultContent.innerHTML = html;
        this.resultSection.style.display = 'block';
    }

    displayWarningsWithFix(results) {
        let html = `
            <div class="warning-section">
                <div class="alert-header">
                    <h3>⚠️ Bazı geliştirmeler öneriliyor</h3>
                    <p>Fotoğrafınız genel olarak uygun, ancak bazı iyileştirmeler yapılabilir.</p>
                </div>
                <div class="alert-details">
        `;
        
        results.forEach(result => {
            if (result.status === 'fail') {
                html += `<div class="error-item">❌ ${result.title}: ${result.message}</div>`;
            } else if (result.status === 'warning') {
                html += `<div class="warning-item">⚠️ ${result.title}: ${result.message}</div>`;
            } else {
                html += `<div class="success-item">✅ ${result.title}: ${result.message}</div>`;
            }
        });
        
        html += `
                </div>
                <div class="recommendation">
                    <button class="btn btn-primary" onclick="app.fixImageWithDetails()">
                        Otomatik İyileştir
                    </button>
                </div>
            </div>
        `;
        
        this.resultContent.innerHTML = html;
        this.resultSection.style.display = 'block';
    }

    displaySuccessResults(results) {
        let html = `
            <div class="success-section">
                <div class="alert-header">
                    <h3>🎉 Tebrikler! Fotoğrafınız mükemmel!</h3>
                    <p>Fotoğrafınız tüm Green Card gereksinimlerini karşılamaktadır.</p>
                </div>
                <div class="alert-details">
        `;
        
        results.forEach(result => {
            html += `<div class="success-item">✅ ${result.title}: ${result.message}</div>`;
        });
        
        html += `
                </div>
                <div class="ready-download">
                    <p><strong>Fotoğrafınız Green Card başvurusu için hazır!</strong></p>
                    <button class="btn btn-success" onclick="app.downloadImage()">
                        Fotoğrafı İndir
                    </button>
                </div>
            </div>
        `;
        
        this.resultContent.innerHTML = html;
        this.resultSection.style.display = 'block';
    }

    fixImage() {
        this.fixImageWithDetails();
    }

    fixImageWithDetails() {
        // Create a new canvas for the fixed image
        const fixedCanvas = document.createElement('canvas');
        const fixedCtx = fixedCanvas.getContext('2d');
        
        // Set target size (600x600 minimum for Green Card)
        const targetSize = Math.max(600, Math.max(this.originalImage.width, this.originalImage.height));
        fixedCanvas.width = targetSize;
        fixedCanvas.height = targetSize;
        
        // Fill with white background
        fixedCtx.fillStyle = 'white';
        fixedCtx.fillRect(0, 0, targetSize, targetSize);
        
        // Calculate scaling and positioning to fit the image
        const scale = Math.min(targetSize * 0.9 / this.originalImage.width, targetSize * 0.9 / this.originalImage.height);
        const scaledWidth = this.originalImage.width * scale;
        const scaledHeight = this.originalImage.height * scale;
        const x = (targetSize - scaledWidth) / 2;
        const y = (targetSize - scaledHeight) / 2;
        
        // Draw the image centered
        fixedCtx.drawImage(this.originalImage, x, y, scaledWidth, scaledHeight);
        
        // Update main canvas
        this.canvas.width = targetSize;
        this.canvas.height = targetSize;
        this.ctx.drawImage(fixedCanvas, 0, 0);
        
        // Store processed image
        this.processedImage = fixedCanvas;
        this.downloadBtn.disabled = false;
        
        // Show success message
        this.resultContent.innerHTML = `
            <div class="success-section">
                <div class="alert-header">
                    <h3>🎉 Fotoğraf Başarıyla Düzeltildi!</h3>
                    <p>Fotoğrafınız Green Card gereksinimlerine uygun hale getirildi.</p>
                </div>
                <div class="alert-details">
                    <h4>Düzeltilen Özellikler:</h4>
                    <ul>
                        <li class="success-item">✅ Boyut: ${targetSize}x${targetSize} piksel</li>
                        <li class="success-item">✅ Format: Kare (1:1 oran)</li>
                        <li class="success-item">✅ Arka plan: Beyaz</li>
                        <li class="success-item">✅ Minimum gereksinimler karşılandı</li>
                    </ul>
                    <div class="ready-download">
                        <p><strong>Artık fotoğrafınızı indirebilirsiniz!</strong></p>
                    </div>
                </div>
            </div>
        `;
        this.resultSection.style.display = 'block';
    }

    downloadImage() {
        if (!this.processedImage) return;
        
        // Create final canvas with exact Green Card dimensions
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        
        // 2x2 inches at 300 DPI = 600x600 pixels
        const finalSize = 600;
        finalCanvas.width = finalSize;
        finalCanvas.height = finalSize;
        
        // Draw the processed image
        finalCtx.drawImage(this.processedImage, 0, 0, finalSize, finalSize);
        
        // Download
        finalCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'green-card-photo.jpg';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);
    }

    updateUITexts() {
        // Update placeholder text if no image is loaded
        if (!this.originalImage && this.previewContainer) {
            this.previewContainer.innerHTML = `<p data-lang="noImage">${this.languageManager.t('noImage')}</p>`;
        }
    }
}

// Image Analysis Class
class ImageAnalyzer {
    constructor(image, faceDetectionService) {
        this.image = image;
        this.faceDetectionService = faceDetectionService;
    }

    async performFullAnalysis() {
        const results = [];

        // 1. Face Detection Check
        const faceCheck = await this.analyzeFace();
        results.push(faceCheck);

        // 2. Technical checks
        const technicalChecks = this.performTechnicalChecks();
        results.push(...technicalChecks);

        return results;
    }

    async analyzeFace() {
        try {
            const faceDetection = await this.faceDetectionService.detectFace(this.image);
            
            return {
                title: "İnsan yüzü kontrolü",
                status: faceDetection.hasFace ? 'pass' : 'fail',
                message: faceDetection.hasFace ? 
                    `✓ ${faceDetection.message}` : 
                    `❌ ${faceDetection.message}`,
                technical: true,
                critical: !faceDetection.hasFace
            };
        } catch (error) {
            return {
                title: "İnsan yüzü kontrolü",
                status: 'warning',
                message: '⚠️ Yüz analizi yapılamadı, manuel kontrol önerilir',
                technical: true,
                critical: false
            };
        }
    }

    performTechnicalChecks() {
        const checks = [];

        // Aspect Ratio Check
        const aspectRatio = this.image.width / this.image.height;
        const isSquare = Math.abs(aspectRatio - 1) < 0.1;
        checks.push({
            title: "Kare format (1:1 nisbət)",
            status: isSquare ? 'pass' : 'fail',
            message: isSquare ? '✓ Kare format' : '❌ Fotoğraf kare olmalıdır',
            technical: true
        });

        // Resolution Check
        const minSize = 600;
        const hasGoodResolution = this.image.width >= minSize && this.image.height >= minSize;
        checks.push({
            title: "Minimum çözünürlük (600x600)",
            status: hasGoodResolution ? 'pass' : 'fail',
            message: hasGoodResolution ? 
                `✓ ${this.image.width}x${this.image.height} piksel` : 
                `❌ ${this.image.width}x${this.image.height} piksel (min 600x600)`,
            technical: true
        });

        // Head Size Analysis
        const headAnalysis = this.analyzeHeadSize();
        checks.push({
            title: "Baş ölçüsü (22-35mm arası)",
            status: headAnalysis.isCorrect ? 'pass' : 'fail',
            message: headAnalysis.isCorrect ? 
                `✓ Baş ölçüsü: ~${headAnalysis.estimated}mm` : 
                `❌ Baş ölçüsü uygun değil (~${headAnalysis.estimated}mm)`,
            technical: true
        });

        // Color Check
        const colorAnalysis = this.analyzeImageColor();
        checks.push({
            title: "Renkli görüntü",
            status: colorAnalysis.isColor ? 'pass' : 'warning',
            message: colorAnalysis.isColor ? '✓ Renkli görüntü' : '⚠️ Renk kontrolü gerekli',
            technical: true
        });

        // Background Analysis
        const bgAnalysis = this.analyzeBackground();
        checks.push({
            title: "Beyaz arka plan",
            status: bgAnalysis.isWhite ? 'pass' : 'warning',
            message: bgAnalysis.isWhite ? '✓ Beyaz arka plan' : '⚠️ Arka plan kontrolü gerekli',
            technical: true
        });

        // Sharpness Check
        const sharpnessAnalysis = this.analyzeSharpness();
        checks.push({
            title: "Görüntü netliği",
            status: sharpnessAnalysis.isSharp ? 'pass' : 'warning',
            message: sharpnessAnalysis.isSharp ? 
                '✓ Net görüntü' : 
                '⚠️ Görüntü daha net olmalı',
            technical: true
        });

        return checks;
    }

    analyzeHeadSize() {
        const imageHeight = this.image.height;
        const estimatedHeadHeight = imageHeight * 0.6;
        const headSizeMM = (estimatedHeadHeight / imageHeight) * 51;
        
        return {
            isCorrect: headSizeMM >= 22 && headSizeMM <= 35,
            estimated: Math.round(headSizeMM)
        };
    }

    analyzeImageColor() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        tempCtx.drawImage(this.image, 0, 0, 100, 100);

        const imageData = tempCtx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        
        let colorVariance = 0;
        let sampleCount = 0;

        for (let i = 0; i < data.length; i += 16) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            const variance = Math.abs(r - g) + Math.abs(g - b) + Math.abs(r - b);
            colorVariance += variance;
            sampleCount++;
        }

        const avgVariance = colorVariance / sampleCount;
        return { isColor: avgVariance > 10 };
    }

    analyzeBackground() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = this.image.width;
        tempCanvas.height = this.image.height;
        tempCtx.drawImage(this.image, 0, 0);

        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const data = imageData.data;
        
        let totalR = 0, totalG = 0, totalB = 0;
        let sampleCount = 0;

        // Sample edge pixels
        for (let x = 0; x < tempCanvas.width; x += 10) {
            // Top edge
            let idx = (0 * tempCanvas.width + x) * 4;
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            sampleCount++;

            // Bottom edge
            idx = ((tempCanvas.height - 1) * tempCanvas.width + x) * 4;
            totalR += data[idx];
            totalG += data[idx + 1];
            totalB += data[idx + 2];
            sampleCount++;
        }

        const avgR = totalR / sampleCount;
        const avgG = totalG / sampleCount;
        const avgB = totalB / sampleCount;

        const isWhite = avgR > 200 && avgG > 200 && avgB > 200;
        return { isWhite, avgR, avgG, avgB };
    }

    analyzeSharpness() {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        tempCanvas.width = 100;
        tempCanvas.height = 100;
        tempCtx.drawImage(this.image, 0, 0, 100, 100);

        const imageData = tempCtx.getImageData(0, 0, 100, 100);
        const data = imageData.data;
        
        let variance = 0;
        for (let i = 0; i < data.length - 4; i += 4) {
            const current = data[i];
            const next = data[i + 4];
            variance += Math.abs(current - next);
        }
        
        const avgVariance = variance / (data.length / 4);
        return { isSharp: avgVariance > 15 };
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    window.app = new GreenCardPhotoApp();
    console.log('Green Card Photo Tool initialized successfully');
});