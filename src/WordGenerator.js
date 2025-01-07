import { call } from "three/webgpu";
import LanguageHandler from "./LanguageHandler";

export default class WordGenerator {
    constructor(config) {
        this.config = config; 
        this.languageHandler = new LanguageHandler(this.config.language); 
        this.wordArray = [];
        //this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        this.word = ""; 
        this.currentWord = "";
        this.callbacks = []; // Liste von Callbacks

        // Callback-Referenz für Änderungen
        this.onWordChangeCallback = null;
        this.onGameCompletedCallback = false; 

        // Event-Listener für Button
        
    }

    setWordArray(array) {
        this.wordArray = array; 
        if (this.wordArray.length > 0) {
            this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        }
    }
    
    generateRandomWord() {
        this.word = this.wordArray[Math.floor(Math.random() * this.wordArray.length)];
        this.currentWord = this.word; 
        console.trace("generated new word!")
        //return this.languageHandler.getTranslation(word); 
    }

    onGenerateNewWord() {
      // Überprüfen, ob noch Wörter verfügbar sind
      if (this.wordArray.length === 0) {
        this.word = "complete!"
        return; // Beende die Methode, da keine Wörter mehr vorhanden sind
    }
    if (this.currentWord !== null) {
        const index = this.wordArray.indexOf(this.currentWord);
        if (index !== -1) {
            this.wordArray.splice(index, 1);
            console.log("current word array", this.wordArray)
        }
    }
    console.log("current word", this.currentWord)
    console.log("current array", this.wordArray)
        // Neues Wort zufällig auswählen
        this.generateRandomWord();
        console.log("Neues Wort:", this.word);
        console.log("Verbleibende Wörter:", this.wordArray);

        this.callbacks.forEach((callback) => callback(this.currentWord));
        
    }

    // Methode zum Setzen der Callback-Funktion
    setOnWordChangeCallback(callback) {
        this.callbacks.push(callback); // Callback zur Liste hinzufügen
    }
}
