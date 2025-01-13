// TranslationManager.js
import livingRoomTranslations from '../translations/translation-livingroom.json';
import bedroomTranslations from '../translations/translation-bedroom.json';
import shapesTranslations from '../translations/translation-shapes.json';

export default class TranslationManager {
    constructor(config) {
        this.config = config;
        this.translations = null;
        this.currentScene = null;
    }

    loadTranslations(scene) {
        this.currentScene = scene;
        this.translations = this.getTranslationFile(scene);
        return true;
    }

    generateRandomWord() {
        // Wählt zufälliges Wort aus dem Array
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        this.translatedWord = this.translationManager.getTranslation(this.word);
    }

    getTranslationFile(scene) {
        switch(scene) {
            case 'scene1':
                return livingRoomTranslations;
            case 'scene2':
                return bedroomTranslations;
            case 'scene3':
                return shapesTranslations;
            default:
                throw new Error(`Unknown scene: ${scene}`);
        }
    }

    getNodeNamesFromGLTF(url) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                url,
                (gltf) => {
                    const nodeNameArray = [];
                    gltf.scene.traverse((node) => {
                        if (node.name) {
                          if (node.name != "Scene") {
                            nodeNameArray.push(node.name); 
                          } 
                        }
                    });
                    resolve(nodeNameArray);
                },
                undefined,
                (error) => {
                    reject(error);
                }
            );
        });
    }

    getTranslation(originalWord) {
        if (!this.translations || !this.config.language) {
            console.warn('Translations not loaded or language not set');
            return originalWord;
        }

        const languageTranslations = this.translations[this.config.language];
        if (!languageTranslations) {
            console.warn(`No translations found for language: ${this.config.language}`);
            return originalWord;
        }

        return languageTranslations[originalWord] || originalWord;
    }

    getOriginalWord(translatedWord) {
        if (!this.translations || !this.config.language) {
            return translatedWord;
        }

        const languageTranslations = this.translations[this.config.language];
        if (!languageTranslations) {
            return translatedWord;
        }

        // Suche nach dem Original-Wort
        for (const [original, translation] of Object.entries(languageTranslations)) {
            if (translation === translatedWord) {
                return original;
            }
        }

        return translatedWord;
    }
}