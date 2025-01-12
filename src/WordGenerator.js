import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class WordGenerator {
    constructor(config) {
        this.config = config;
        this.wordArray = [];
        this.word = "";
        this.currentWord = "";
        this.callbacks = [];
        this.onWordChangeCallback = null;
        this.onGameCompletedCallback = false;
    }

    setWordArray(array) {
        if (!Array.isArray(array)) {
            console.error("Invalid word array provided");
            return;
        }
        this.wordArray = array;
        if (this.wordArray.length > 0) {
            this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
            this.currentWord = this.word;
        }
    }

    generateRandomWord() {
        if (this.wordArray.length === 0) {
            console.warn("No words available to generate");
            return null;
        }
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        this.currentWord = this.word;
        return this.word;
    }

    onGenerateNewWord() {
        if (this.wordArray.length === 0) {
            this.word = "complete!";
            return;
        }

        if (this.currentWord !== null) {
            const index = this.wordArray.indexOf(this.currentWord);
            if (index !== -1) {
                this.wordArray.splice(index, 1);
            }
        }

        this.generateRandomWord();
        
        // Benachrichtige alle registrierten Callbacks
        if (this.callbacks && this.callbacks.length > 0) {
            this.callbacks.forEach(callback => {
                if (typeof callback === 'function') {
                    callback(this.currentWord);
                }
            });
        }
    }

    setOnWordChangeCallback(callback) {
        if (typeof callback !== 'function') {
            console.error("Invalid callback provided to setOnWordChangeCallback");
            return;
        }
        this.callbacks.push(callback);
    }

    getCurrentWord() {
        return this.currentWord;
    }

    getRemainingWords() {
        return this.wordArray.length;
    }
}