import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class WordGenerator {
    constructor(config, translationManager) {
        this.config = config;
        this.translationManager = translationManager;
        this.wordArray = [];
        this.word = ""; // Original word from 3D scene
        this.translatedWord = ""; // Translated word from JSON
        this.callbacks = [];
    }

    init() {
        this.translationManager.loadTranslations(this.config.selectedScene);
    }

    setWordArray(array) {
        if (!Array.isArray(array)) {
            console.error("Invalid word array provided");
            return;
        }
        this.wordArray = array;
        if (this.wordArray.length > 0) {
            this.generateRandomWord();
        }
    }

    convertSceneNameToJsonName(sceneName) {
        // Beispiele für Konvertierung:
        // "Book001_5" -> "Book.001"
        // "Cupboard002_2" -> "Cupboard.002"
        
        // Entferne Zahlen am Ende nach dem Unterstrich
        let baseName = sceneName.split('_')[0];
        
        // Ersetze dreistellige Zahlen im Namen durch .00X Format
        baseName = baseName.replace(/(\d{3})/, '.$1');
        
        return baseName;
    }

    generateRandomWord() {
        if (this.wordArray.length === 0) {
            console.warn("No words available to generate");
            return null;
        }

        // Wähle zufälliges Wort aus dem Array
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        
        // Konvertiere den Namen für JSON-Lookup
        const jsonName = this.convertSceneNameToJsonName(this.word);
        
        // Hole Übersetzung aus TranslationManager
        this.translatedWord = this.translationManager.getTranslation(jsonName);
        
        console.log("Original word (scene):", this.word);
        console.log("JSON lookup name:", jsonName);
        console.log("Translated word:", this.translatedWord);
        
        // Notify callbacks with translated word
        this.notifyWordChange(this.translatedWord);
        
        return this.word;
    }

    onGenerateNewWord() {
        if (this.wordArray.length === 0) {
            this.word = "complete";
            this.translatedWord = "complete";
            return;
        }

        // Remove current word from array
        if (this.word !== null) {
            const index = this.wordArray.indexOf(this.word);
            if (index !== -1) {
                this.wordArray.splice(index, 1);
            }
        }

        this.generateRandomWord();
    }

    setOnWordChangeCallback(callback) {
        if (typeof callback !== 'function') {
            console.error("Invalid callback provided to setOnWordChangeCallback");
            return;
        }
        this.callbacks.push(callback);
    }

    notifyWordChange() {
        console.log("Notifying word change:", this.word); // Debug output
        if (this.callbacks && this.callbacks.length > 0) {
            this.callbacks.forEach(callback => {
                if (typeof callback === 'function') {
                    callback(this.word);
                }
            });
        }
    }

    getCurrentWord() {
        return this.word; // Original word für 3D-Szene
    }

    getCurrentTranslation() {
        return this.translatedWord;
    }

    getRemainingWords() {
        return this.wordArray.length;
    }
}