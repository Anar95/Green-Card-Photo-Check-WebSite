/**
 * Multi-language translations for Green Card Photo Tool
 * Supports: Turkish, English, German, Polish, Russian, Spanish, and more
 */

const translations = {
    tr: {
        // Header
        title: "🇺🇸 Green Card Foto Hazırlayıcı",
        subtitle: "ABŞ Green Card üçün foto tələblərinə uyğun şəkil hazırlayın",
        
        // Upload Section
        uploadText: "Şəklinizi buraya yükləyin",
        selectFile: "Fayl seçin",
        
        // Preview Section
        preview: "Önizləmə",
        noImage: "Şəkil yüklənməyib",
        
        // Controls
        checkReq: "Tələbləri Yoxla",
        fixImage: "Şəkli Düzəlt",
        download: "Yüklə",
        
        // Results
        checkResult: "Yoxlama Nəticəsi",
        
        // Requirements
        requirements: "Green Card Foto Tələbləri",
        sizeReqs: "📏 Ölçü Tələbləri",
        background: "🎨 Arxa Fon",
        personal: "👤 Şəxsi Tələblər",
        quality: "⚡ Keyfiyyət",
        
        // Size Requirements
        size1: "2x2 düym (51x51mm)",
        size2: "Baş ölçüsü: 25-35mm",
        size3: "Göz səviyyəsi düzgün",
        
        // Background Requirements
        bg1: "Ağ rəng",
        bg2: "Heç bir naxış yox",
        bg3: "Kölgəsiz",
        
        // Personal Requirements
        pers1: "Üz kameraya baxmalı",
        pers2: "Təbii ifadə",
        pers3: "Gözlük qadağan",
        
        // Quality Requirements
        qual1: "Yüksək həlledicilik",
        qual2: "Net görüntü",
        qual3: "Son 6 ay ərzində",
        
        // Technical Checks
        aspectRatio: "Kare format (1:1 nisbət)",
        aspectRatioFail: "❌ Fotoğraf kare olmalıdır",
        minResolution: "Minimum çözünürlük (600x600)",
        maxFileSize: "Maksimum dosya boyutu (240 KB)",
        minFileSize: "Minimum dosya boyutu (54 KB)",
        jpegFormat: "JPEG formatı",
        realColor: "Renkli görüntü",
        whiteBackground: "Beyaz arka plan",
        
        // Error Messages
        technicalError: "Teknik Sorunlar Tespit Edildi",
        autoFixSuggestion: "Fotoğrafınızda bazı teknik sorunlar tespit edildi. Otomatik düzeltme özelliğimiz bu sorunları çözebilir.",
        willAdjust: "Aşağıdaki özellikler otomatik olarak düzeltilecek:",
        fixSuccess: "🎉 Fotoğraf Başarıyla Düzeltildi!",
        fixedMessage: "Fotoğrafınız Green Card gereksinimlerine uygun hale getirildi.",
        
        // Face Detection
        faceDetected: "İnsan yüzü tespit edildi",
        noFaceDetected: "İnsan yüzü tespit edilemedi",
        multipleFaces: "Birden fazla yüz tespit edildi",
        faceInstructions: "Lütfen sadece bir kişinin net görünebildiği fotoğraf yükleyin",
        
        // Examples
        examples: "Foto Nümunələri",
        examplesDesc: "ABŞ Dövlət Departamentindən rəsmi nümunələr",
        correctPhotos: "✅ Düzgün Fotolar",
        incorrectPhotos: "❌ Yanlış Fotolar",
        
        // Example Descriptions
        example1Title: "Standart portret",
        example1Desc: "Ağ fon, düzgün ölçü, təbii baxış",
        example2Title: "Qadın portreti",
        example2Desc: "Düzgün işıqlandırma, kölgəsiz",
        wrongBg: "Yanlış arxa fon",
        wrongBgDesc: "Mavi fon qəbul edilmir",
        withGlasses: "Gözlüklə foto",
        glassesDesc: "Gözlük qadağandır",
        sideView: "Yan baxış",
        sideViewDesc: "Üz kameraya baxmalıdır",
        
        // Official Source
        officialSource: "📋 Mənbə: travel.state.gov - ABŞ Dövlət Departamenti",
        
        // Success Messages
        photoReady: "Fotoğrafınız Green Card başvurusu için hazır!",
        allRequirementsMet: "Tüm gereksinimler karşılandı",
        downloadReady: "İndirmeye hazır",
        
        // Face Detection Error Messages
        faceNotDetected: "İnsan Yüzü Tespit Edilemedi",
        faceNotDetectedMsg: "Bu resimde insan yüzü tespit edilemedi. Lütfen net bir portre fotoğrafı yükleyin.",
        faceBlurryMsg: "Fotoğraf çok bulanık veya düşük kaliteli. Daha net bir fotoğraf yükleyin.",
        faceTooCloseMsg: "Fotoğraf çok yakın çekilmiş olabilir. Lütfen daha uzaktan çekilen bir fotoğraf deneyin.",
        faceAnalysisFailedMsg: "Yüz analizi yapılamadı, manuel kontrol önerilir.",
        faceDetectedSuccess: "İnsan yüzü tespit edildi (temel analiz).",
        
        // Error Suggestions
        errorSuggestions: "Öneriler:",
        suggestion1: "• Yüzünüz fotoğrafta net görünmelidir",
        suggestion2: "• Sadece bir kişi olmalıdır", 
        suggestion3: "• Kameraya doğrudan bakın",
        suggestion4: "• Yeterli ışık olduğundan emin olun",
        newPhotoBtn: "Yeni Fotoğraf Yükle",
        
        // File Error Messages
        invalidFileType: "Zəhmət olmasa şəkil faylı seçin!",
        
        // Bypass Options
        continueAnyway: "Şəkli yenə də istifadə et",
        bypassWarning: "Diqqət: Face detection xəta verdi, ancaq siz yenə də davam edə bilərsiniz"
    },

    en: {
        // Header
        title: "🇺🇸 Green Card Photo Maker",
        subtitle: "Create photos that meet US Green Card requirements",
        
        // Upload Section
        uploadText: "Upload your photo here",
        selectFile: "Select File",
        
        // Preview Section
        preview: "Preview",
        noImage: "No image uploaded",
        
        // Controls
        checkReq: "Check Requirements",
        fixImage: "Fix Photo",
        download: "Download",
        
        // Results
        checkResult: "Check Result",
        
        // Requirements
        requirements: "Green Card Photo Requirements",
        sizeReqs: "📏 Size Requirements",
        background: "🎨 Background",
        personal: "👤 Personal Requirements",
        quality: "⚡ Quality",
        
        // Size Requirements
        size1: "2x2 inches (51x51mm)",
        size2: "Head size: 25-35mm",
        size3: "Eye level correct",
        
        // Background Requirements
        bg1: "White color",
        bg2: "No patterns",
        bg3: "No shadows",
        
        // Personal Requirements
        pers1: "Face looking at camera",
        pers2: "Natural expression",
        pers3: "No glasses",
        
        // Quality Requirements
        qual1: "High resolution",
        qual2: "Clear image",
        qual3: "Within last 6 months",
        
        // Technical Checks
        aspectRatio: "Square format (1:1 ratio)",
        aspectRatioFail: "❌ Photo must be square",
        minResolution: "Minimum resolution (600x600)",
        maxFileSize: "Maximum file size (240 KB)",
        minFileSize: "Minimum file size (54 KB)",
        jpegFormat: "JPEG format",
        realColor: "Color image",
        whiteBackground: "White background",
        
        // Error Messages
        technicalError: "Technical Issues Detected",
        autoFixSuggestion: "Some technical issues were detected in your photo. Our auto-fix feature can resolve these issues.",
        willAdjust: "The following features will be automatically adjusted:",
        fixSuccess: "🎉 Photo Successfully Fixed!",
        fixedMessage: "Your photo has been adjusted to meet Green Card requirements.",
        
        // Face Detection
        faceDetected: "Human face detected",
        noFaceDetected: "No human face detected",
        multipleFaces: "Multiple faces detected",
        faceInstructions: "Please upload a photo with only one person clearly visible",
        
        // Examples
        examples: "Photo Examples",
        examplesDesc: "Official examples from US State Department",
        correctPhotos: "✅ Correct Photos",
        incorrectPhotos: "❌ Incorrect Photos",
        
        // Example Descriptions
        example1Title: "Standard portrait",
        example1Desc: "White background, correct size, natural look",
        example2Title: "Female portrait",
        example2Desc: "Proper lighting, no shadows",
        wrongBg: "Wrong background",
        wrongBgDesc: "Blue background not accepted",
        withGlasses: "Photo with glasses",
        glassesDesc: "Glasses are prohibited",
        sideView: "Side view",
        sideViewDesc: "Face must look at camera",
        
        // Official Source
        officialSource: "📋 Source: travel.state.gov - US State Department",
        
        // Success Messages
        photoReady: "Your photo is ready for Green Card application!",
        allRequirementsMet: "All requirements met",
        downloadReady: "Ready to download",
        
        // Face Detection Error Messages
        faceNotDetected: "Human Face Not Detected",
        faceNotDetectedMsg: "No human face could be detected in this image. Please upload a clear portrait photo.",
        faceBlurryMsg: "Photo is too blurry or low quality. Please upload a sharper photo.",
        faceTooCloseMsg: "Photo might be taken too close. Please try a photo taken from further away.",
        faceAnalysisFailedMsg: "Face analysis could not be performed, manual review recommended.",
        faceDetectedSuccess: "Human face detected (basic analysis).",
        
        // Error Suggestions  
        errorSuggestions: "Suggestions:",
        suggestion1: "• Your face should be clearly visible in the photo",
        suggestion2: "• Only one person should be present",
        suggestion3: "• Look directly at the camera", 
        suggestion4: "• Make sure there is sufficient lighting",
        newPhotoBtn: "Upload New Photo",
        
        // File Error Messages
        invalidFileType: "Please select an image file!",
        
        // Bypass Options
        continueAnyway: "Continue with this photo anyway",
        bypassWarning: "Warning: Face detection failed, but you can still proceed"
    },

    de: {
        // Header
        title: "🇺🇸 Green Card Foto Ersteller",
        subtitle: "Erstellen Sie Fotos nach US Green Card Anforderungen",
        
        // Upload Section
        uploadText: "Laden Sie Ihr Foto hier hoch",
        selectFile: "Datei auswählen",
        
        // Preview Section
        preview: "Vorschau",
        noImage: "Kein Bild hochgeladen",
        
        // Controls
        checkReq: "Anforderungen prüfen",
        fixImage: "Foto korrigieren",
        download: "Herunterladen",
        
        // Results
        checkResult: "Prüfergebnis",
        
        // Requirements
        requirements: "Green Card Foto Anforderungen",
        sizeReqs: "📏 Größenanforderungen",
        background: "🎨 Hintergrund",
        personal: "👤 Persönliche Anforderungen",
        quality: "⚡ Qualität",
        
        // Size Requirements
        size1: "2x2 Zoll (51x51mm)",
        size2: "Kopfgröße: 25-35mm",
        size3: "Augenhöhe korrekt",
        
        // Background Requirements
        bg1: "Weiße Farbe",
        bg2: "Keine Muster",
        bg3: "Ohne Schatten",
        
        // Personal Requirements
        pers1: "Gesicht zur Kamera",
        pers2: "Natürlicher Ausdruck",
        pers3: "Keine Brille",
        
        // Quality Requirements
        qual1: "Hohe Auflösung",
        qual2: "Klares Bild",
        qual3: "Innerhalb der letzten 6 Monate"
    },

    ru: {
        // Header
        title: "🇺🇸 Создатель фото для Green Card",
        subtitle: "Создавайте фотографии, соответствующие требованиям Green Card США",
        
        // Upload Section
        uploadText: "Загрузите ваше фото сюда",
        selectFile: "Выбрать файл",
        
        // Preview Section
        preview: "Предпросмотр",
        noImage: "Изображение не загружено",
        
        // Controls
        checkReq: "Проверить требования",
        fixImage: "Исправить фото",
        download: "Скачать",
        
        // Results
        checkResult: "Результат проверки",
        
        // Requirements
        requirements: "Требования к фото Green Card",
        sizeReqs: "📏 Требования к размеру",
        background: "🎨 Фон",
        personal: "👤 Личные требования",
        quality: "⚡ Качество",
        
        // Size Requirements
        size1: "2x2 дюйма (51x51мм)",
        size2: "Размер головы: 25-35мм",
        size3: "Уровень глаз правильный",
        
        // Background Requirements
        bg1: "Белый цвет",
        bg2: "Никаких узоров",
        bg3: "Без теней",
        
        // Personal Requirements
        pers1: "Лицо смотрит в камеру",
        pers2: "Естественное выражение",
        pers3: "Без очков",
        
        // Quality Requirements
        qual1: "Высокое разрешение",
        qual2: "Четкое изображение",
        qual3: "В течение последних 6 месяцев"
    },

    es: {
        // Header
        title: "🇺🇸 Creador de Fotos Green Card",
        subtitle: "Crea fotos que cumplan los requisitos de Green Card de EE.UU.",
        
        // Upload Section
        uploadText: "Sube tu foto aquí",
        selectFile: "Seleccionar archivo",
        
        // Preview Section
        preview: "Vista previa",
        noImage: "No hay imagen subida",
        
        // Controls
        checkReq: "Verificar requisitos",
        fixImage: "Arreglar foto",
        download: "Descargar",
        
        // Results
        checkResult: "Resultado de verificación",
        
        // Requirements
        requirements: "Requisitos de foto Green Card",
        sizeReqs: "📏 Requisitos de tamaño",
        background: "🎨 Fondo",
        personal: "👤 Requisitos personales",
        quality: "⚡ Calidad",
        
        // Size Requirements
        size1: "2x2 pulgadas (51x51mm)",
        size2: "Tamaño de cabeza: 25-35mm",
        size3: "Nivel de ojos correcto",
        
        // Background Requirements
        bg1: "Color blanco",
        bg2: "Sin patrones",
        bg3: "Sin sombras",
        
        // Personal Requirements
        pers1: "Cara mirando a la cámara",
        pers2: "Expresión natural",
        pers3: "Sin gafas",
        
        // Quality Requirements
        qual1: "Alta resolución",
        qual2: "Imagen clara",
        qual3: "Dentro de los últimos 6 meses"
    },

    pl: {
        // Header
        title: "🇺🇸 Kreator Zdjęć Green Card",
        subtitle: "Twórz zdjęcia spełniające wymagania Green Card USA",
        
        // Upload Section
        uploadText: "Prześlij swoje zdjęcie tutaj",
        selectFile: "Wybierz plik",
        
        // Preview Section
        preview: "Podgląd",
        noImage: "Nie przesłano zdjęcia",
        
        // Controls
        checkReq: "Sprawdź wymagania",
        fixImage: "Popraw zdjęcie",
        download: "Pobierz",
        
        // Results
        checkResult: "Wynik sprawdzenia",
        
        // Requirements
        requirements: "Wymagania zdjęcia Green Card",
        sizeReqs: "📏 Wymagania rozmiaru",
        background: "🎨 Tło",
        personal: "👤 Wymagania osobiste",
        quality: "⚡ Jakość",
        
        // Size Requirements
        size1: "2x2 cale (51x51mm)",
        size2: "Rozmiar głowy: 25-35mm",
        size3: "Poziom oczu poprawny",
        
        // Background Requirements
        bg1: "Biały kolor",
        bg2: "Bez wzorów",
        bg3: "Bez cieni",
        
        // Personal Requirements
        pers1: "Twarz patrząca w kamerę",
        pers2: "Naturalny wyraz",
        pers3: "Bez okularów",
        
        // Quality Requirements
        qual1: "Wysoka rozdzielczość",
        qual2: "Wyraźny obraz",
        qual3: "W ciągu ostatnich 6 miesięcy"
    }
};

// Language management class
class LanguageManager {
    constructor() {
        this.currentLang = 'tr'; // Default language
        this.init();
    }

    init() {
        // Try to get language from localStorage or browser
        const savedLang = localStorage.getItem('greencard-photo-lang');
        const browserLang = navigator.language.split('-')[0];
        
        if (savedLang && translations[savedLang]) {
            this.currentLang = savedLang;
        } else if (translations[browserLang]) {
            this.currentLang = browserLang;
        }

        this.setupEventListeners();
        this.updateLanguage();
    }

    setupEventListeners() {
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLang;
            languageSelect.addEventListener('change', (e) => {
                this.setLanguage(e.target.value);
            });
        }
    }

    setLanguage(lang) {
        if (translations[lang]) {
            this.currentLang = lang;
            localStorage.setItem('greencard-photo-lang', lang);
            this.updateLanguage();
        }
    }

    updateLanguage() {
        const elements = document.querySelectorAll('[data-lang]');
        elements.forEach(element => {
            const key = element.getAttribute('data-lang');
            if (translations[this.currentLang] && translations[this.currentLang][key]) {
                if (element.tagName === 'INPUT' && element.type !== 'submit') {
                    element.placeholder = translations[this.currentLang][key];
                } else {
                    element.textContent = translations[this.currentLang][key];
                }
            }
        });

        // Update document title
        if (translations[this.currentLang].title) {
            document.title = translations[this.currentLang].title + ' - Professional Photo Tool';
        }

        // Update language selector
        const languageSelect = document.getElementById('languageSelect');
        if (languageSelect) {
            languageSelect.value = this.currentLang;
        }

        // Trigger custom event for other components
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: this.currentLang }
        }));
    }

    t(key, fallback = '') {
        return (translations[this.currentLang] && translations[this.currentLang][key]) || fallback || key;
    }

    getCurrentLanguage() {
        return this.currentLang;
    }

    getSupportedLanguages() {
        return Object.keys(translations);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { translations, LanguageManager };
} else if (typeof window !== 'undefined') {
    window.translations = translations;
    window.LanguageManager = LanguageManager;
}