/**
 * UI Components Module
 * Handles user interface interactions, notifications, and component management
 */

class UIManager {
    constructor() {
        this.elements = {};
        this.state = {
            hasImage: false,
            isProcessing: false,
            currentStep: 'upload'
        };
        
        this.init();
    }

    init() {
        this.bindElements();
        this.setupEventListeners();
    }

    bindElements() {
        // Main elements
        this.elements = {
            fileInput: document.getElementById('fileInput'),
            uploadArea: document.getElementById('uploadArea'),
            previewContainer: document.getElementById('previewContainer'),
            canvasContainer: document.getElementById('canvasContainer'),
            canvas: document.getElementById('canvas'),
            resultSection: document.getElementById('resultSection'),
            resultContent: document.getElementById('resultContent'),
            
            // Buttons
            checkBtn: document.getElementById('checkBtn'),
            fixBtn: document.getElementById('fixBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            
            // Language
            languageSelect: document.getElementById('languageSelect')
        };

        // Validate elements
        Object.keys(this.elements).forEach(key => {
            if (!this.elements[key]) {
                console.warn(`Element not found: ${key}`);
            }
        });
    }

    setupEventListeners() {
        // Upload area interactions
        if (this.elements.uploadArea) {
            this.elements.uploadArea.addEventListener('click', (e) => {
                if (!e.target.closest('.btn') && this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            });

            // Drag and drop
            this.elements.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.add('dragover');
            });

            this.elements.uploadArea.addEventListener('dragleave', () => {
                this.elements.uploadArea.classList.remove('dragover');
            });

            this.elements.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.elements.uploadArea.classList.remove('dragover');
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    this.handleFileSelect(files[0]);
                }
            });
        }

        // File input change
        if (this.elements.fileInput) {
            this.elements.fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this.handleFileSelect(e.target.files[0]);
                }
            });
        }

        // Upload button in upload area
        const uploadBtn = document.querySelector('.upload-area .btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (this.elements.fileInput) {
                    this.elements.fileInput.click();
                }
            });
        }
    }

    handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            this.showError('Lütfen geçerli bir resim dosyası seçin!');
            return;
        }

        this.state.hasImage = true;
        
        // Trigger file selected event
        this.dispatchEvent('fileSelected', { file });
    }

    // Display image in preview
    displayPreview(imageElement) {
        if (!this.elements.previewContainer) return;
        
        this.elements.previewContainer.innerHTML = '';
        const previewImg = imageElement.cloneNode();
        previewImg.className = 'preview-image';
        previewImg.style.maxWidth = '100%';
        previewImg.style.maxHeight = '300px';
        previewImg.style.borderRadius = '10px';
        previewImg.style.boxShadow = '0 10px 30px rgba(0,0,0,0.1)';
        this.elements.previewContainer.appendChild(previewImg);
    }

    // Setup canvas display
    setupCanvas(imageElement) {
        if (!this.elements.canvas || !this.elements.canvasContainer) return;

        const canvas = this.elements.canvas;
        const ctx = canvas.getContext('2d');
        
        const targetSize = 600; // Display size
        const aspectRatio = imageElement.naturalWidth / imageElement.naturalHeight;
        
        if (aspectRatio > 1) {
            canvas.width = targetSize;
            canvas.height = targetSize / aspectRatio;
        } else {
            canvas.width = targetSize * aspectRatio;
            canvas.height = targetSize;
        }
        
        ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
        this.elements.canvasContainer.style.display = 'block';
    }

    // Update canvas with processed image
    updateCanvas(canvasElement) {
        if (!this.elements.canvas || !canvasElement) return;

        const ctx = this.elements.canvas.getContext('2d');
        this.elements.canvas.width = canvasElement.width;
        this.elements.canvas.height = canvasElement.height;
        ctx.drawImage(canvasElement, 0, 0);
    }

    // Enable/disable buttons
    enableButtons() {
        if (this.elements.checkBtn) this.elements.checkBtn.disabled = false;
        if (this.elements.fixBtn) this.elements.fixBtn.disabled = false;
    }

    enableDownload() {
        if (this.elements.downloadBtn) this.elements.downloadBtn.disabled = false;
    }

    disableButtons() {
        if (this.elements.checkBtn) this.elements.checkBtn.disabled = true;
        if (this.elements.fixBtn) this.elements.fixBtn.disabled = true;
        if (this.elements.downloadBtn) this.elements.downloadBtn.disabled = true;
    }

    // Show loading state
    showLoading(message = 'İşleniyor...') {
        this.state.isProcessing = true;
        this.disableButtons();
        
        // Add loading spinner to buttons
        const buttons = [this.elements.checkBtn, this.elements.fixBtn, this.elements.downloadBtn];
        buttons.forEach(btn => {
            if (btn && !btn.disabled) {
                const originalText = btn.textContent;
                btn.innerHTML = `<div class="spinner" style="width: 20px; height: 20px; margin-right: 8px;"></div> ${message}`;
                btn.dataset.originalText = originalText;
            }
        });
    }

    hideLoading() {
        this.state.isProcessing = false;
        
        // Restore button text
        const buttons = [this.elements.checkBtn, this.elements.fixBtn, this.elements.downloadBtn];
        buttons.forEach(btn => {
            if (btn && btn.dataset.originalText) {
                btn.textContent = btn.dataset.originalText;
                delete btn.dataset.originalText;
            }
        });
    }

    // Display results
    displayResults(analysisResults) {
        if (!this.elements.resultSection || !this.elements.resultContent) return;

        const { hasCriticalIssues, hasFailures, hasWarnings, results } = analysisResults;

        let html = '';

        if (hasCriticalIssues || hasFailures) {
            html = this.generateErrorResults(results);
        } else if (hasWarnings) {
            html = this.generateWarningResults(results);
        } else {
            html = this.generateSuccessResults(results);
        }

        this.elements.resultContent.innerHTML = html;
        this.elements.resultSection.style.display = 'block';
        this.elements.resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    generateErrorResults(results) {
        return `
            <div class="technical-error">
                <div class="error-header">
                    <h3>❌ Teknik Sorunlar Tespit Edildi</h3>
                    <p>Fotoğrafınızda bazı teknik sorunlar tespit edildi. Otomatik düzeltme özelliğimiz bu sorunları çözebilir.</p>
                    <p><strong>Aşağıdaki özellikler otomatik olarak düzeltilecek:</strong></p>
                </div>
                <div class="error-details">
                    <h4>Tespit Edilen Sorunlar:</h4>
                    <ul>
                        ${results.map(result => `
                            <li class="${this.getResultItemClass(result.status)}">
                                ${result.message}
                            </li>
                        `).join('')}
                    </ul>
                    <div class="fix-suggestion">
                        <button class="btn btn-primary" onclick="window.app.fixImage()">
                            Fotoğrafı Otomatik Düzelt
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    generateWarningResults(results) {
        return `
            <div class="warning-section">
                <div class="warning-header">
                    <h3>⚠️ Bazı geliştirmeler öneriliyor</h3>
                    <p>Fotoğrafınız genel olarak uygun, ancak bazı iyileştirmeler yapılabilir.</p>
                </div>
                <div class="warning-details">
                    ${results.map(result => `
                        <div class="${this.getResultItemClass(result.status)}">${result.message}</div>
                    `).join('')}
                </div>
                <div class="recommendation">
                    <button class="btn btn-primary" onclick="window.app.fixImage()">
                        Otomatik İyileştir
                    </button>
                </div>
            </div>
        `;
    }

    generateSuccessResults(results) {
        return `
            <div class="success-section">
                <div class="success-header">
                    <h3>🎉 Tebrikler! Fotoğrafınız mükemmel!</h3>
                    <p>Fotoğrafınız tüm Green Card gereksinimlerini karşılamaktadır.</p>
                </div>
                <div class="success-details">
                    ${results.map(result => `
                        <div class="success-item">✅ ${result.title}: ${result.message}</div>
                    `).join('')}
                </div>
                <div class="ready-download">
                    <p><strong>Fotoğrafınız Green Card başvurusu için hazır!</strong></p>
                    <button class="btn btn-success" onclick="window.app.downloadImage()">
                        Fotoğrafı İndir
                    </button>
                </div>
            </div>
        `;
    }

    getResultItemClass(status) {
        switch (status) {
            case 'pass': return 'success-item';
            case 'warning': return 'warning-item';
            case 'fail': return 'error-item';
            default: return 'warning-item';
        }
    }

    // Show face detection error
    showFaceDetectionError(message) {
        if (!this.elements.previewContainer) return;

        const errorHtml = `
            <div class="face-detection-error">
                <div class="error-icon">👤❌</div>
                <h3>İnsan Yüzü Tespit Edilemedi</h3>
                <p>${message}</p>
                <div class="suggestions">
                    <h4>Öneriler:</h4>
                    <ul>
                        <li>Yüzünüz fotoğrafta net görünmelidir</li>
                        <li>Sadece bir kişi olmalıdır</li>
                        <li>Kameraya doğrudan bakın</li>
                        <li>Yeterli ışık olduğundan emin olun</li>
                    </ul>
                </div>
                <button class="btn" onclick="window.app.resetUpload()">Yeni Fotoğraf Yükle</button>
            </div>
        `;
        
        this.elements.previewContainer.innerHTML = errorHtml;
        if (this.elements.canvasContainer) {
            this.elements.canvasContainer.style.display = 'none';
        }
        this.disableButtons();
    }

    // Show success notification
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    // Show error notification
    showError(message) {
        this.showNotification(message, 'error');
    }

    // Show warning notification
    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    // Generic notification system
    showNotification(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;

        document.body.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);

        return toast;
    }

    getNotificationIcon(type) {
        switch (type) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            default: return 'ℹ️';
        }
    }

    // Reset upload state
    resetUpload() {
        this.state.hasImage = false;
        this.state.currentStep = 'upload';
        
        if (this.elements.fileInput) {
            this.elements.fileInput.value = '';
        }
        
        if (this.elements.previewContainer) {
            this.elements.previewContainer.innerHTML = '<p data-lang="noImage">Şəkil yüklənməyib</p>';
        }
        
        if (this.elements.canvasContainer) {
            this.elements.canvasContainer.style.display = 'none';
        }
        
        if (this.elements.resultSection) {
            this.elements.resultSection.style.display = 'none';
        }
        
        this.disableButtons();
        
        // Trigger reset event
        this.dispatchEvent('reset');
    }

    // Update UI for language change
    updateForLanguage(language) {
        // Update placeholder text if no image is loaded
        if (!this.state.hasImage && this.elements.previewContainer) {
            const translations = window.translations;
            if (translations && translations[language] && translations[language].noImage) {
                this.elements.previewContainer.innerHTML = `<p data-lang="noImage">${translations[language].noImage}</p>`;
            }
        }
    }

    // Progress bar management
    showProgress(percent) {
        let progressBar = document.querySelector('.progress-bar');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'progress-bar';
            progressBar.innerHTML = '<div class="progress-fill"></div>';
            
            if (this.elements.resultSection) {
                this.elements.resultSection.appendChild(progressBar);
            }
        }
        
        const fill = progressBar.querySelector('.progress-fill');
        if (fill) {
            fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
        }
    }

    hideProgress() {
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.remove();
        }
    }

    // Modal management
    showModal(title, content, buttons = []) {
        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-footer">
                ${buttons.map(btn => `<button class="btn ${btn.class || ''}" onclick="${btn.onclick || ''}">${btn.text}</button>`).join('')}
            </div>
        `;
        
        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);
        
        // Close on overlay click
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                this.closeModal();
            }
        });
        
        return modalOverlay;
    }

    closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.remove();
        }
    }

    // Event system
    dispatchEvent(eventName, data = {}) {
        const event = new CustomEvent(`greencard-${eventName}`, { detail: data });
        document.dispatchEvent(event);
    }

    addEventListener(eventName, callback) {
        document.addEventListener(`greencard-${eventName}`, callback);
    }

    // Get current state
    getState() {
        return { ...this.state };
    }

    // Update state
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.dispatchEvent('stateChanged', this.state);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UIManager;
} else if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}