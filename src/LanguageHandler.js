export default class LanguageHandler {
    constructor(language, translationsPath) {
        this.language = language;
        this.translationsPath = translationsPath;
        this.translations = {};
    }

    // Lädt die Übersetzungen mit fetch
    async loadTranslations() {
        try {
            const response = await fetch(this.translationsPath);
            if (!response.ok) {
                throw new Error(`Failed to load translations: ${response.statusText}`);
            }
            this.translations = await response.json();
        } catch (error) {
            console.error(`Error loading translations from ${this.translationsPath}:`, error);
        }
    }

    // Gibt die Übersetzung eines Wortes zurück
    getTranslation(word) {
        if (!this.translations[this.language]) {
            return `Missing translations for language: ${this.language}`;
        }
        return (
            this.translations[this.language][word] ||
            `Missing translation: ${word}`
        );
    }
}