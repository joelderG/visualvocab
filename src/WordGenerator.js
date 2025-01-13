import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class WordGenerator {
  constructor(config, translationManager) {
    this.config = config;
    this.translationManager = translationManager;
    this.availableBaseIds = []; // Verfügbare Basis-IDs aus den Mappings
    this.currentBaseId = null; // Aktuelle Basis-ID (z.B. "tv", "book")
    this.callbacks = []; // Callbacks für Wortänderungen
  }

  init() {
    // Lade Übersetzungen für die ausgewählte Szene
    this.translationManager.loadTranslations(this.config.selectedScene);
    // Hole alle verfügbaren Basis-IDs aus den Mappings
    this.availableBaseIds = this.translationManager.getAllBaseIds();
  }

  // Generiert ein neues zufälliges Wort
  generateRandomWord() {
    if (this.availableBaseIds.length === 0) {
      console.log("No more words available");
      this.currentBaseId = null;
      this.notifyWordChange("complete");
      return null;
    }

    // Wähle zufällige Basis-ID
    const randomIndex = Math.floor(
      Math.random() * this.availableBaseIds.length
    );
    this.currentBaseId = this.availableBaseIds[randomIndex];

    // Hole übersetzte Version
    const translatedWord = this.translationManager.getTranslation(
      this.currentBaseId
    );

    console.log(`Generated word: ${this.currentBaseId} (${translatedWord})`);

    // Informiere alle Listener über das neue Wort
    this.notifyWordChange(translatedWord);

    return translatedWord;
  }

  // Wird aufgerufen, wenn ein Wort erfolgreich gefunden wurde
  onGenerateNewWord() {
    // Entferne das aktuelle Wort aus den verfügbaren Wörtern
    if (this.currentBaseId) {
      const index = this.availableBaseIds.indexOf(this.currentBaseId);
      if (index !== -1) {
        this.availableBaseIds.splice(index, 1);
      }
    }

    return this.generateRandomWord();
  }

  // Registriert einen Callback für Wortänderungen
  setOnWordChangeCallback(callback) {
    if (typeof callback === "function") {
      this.callbacks.push(callback);
    }
  }

  // Informiert alle registrierten Callbacks über Wortänderungen
  notifyWordChange(word) {
    this.callbacks.forEach((callback) => callback(word));
  }

  // Getter für das aktuelle Wort
  getCurrentBaseId() {
    return this.currentBaseId;
  }

  // Getter für die übersetzte Version des aktuellen Wortes
  getCurrentTranslation() {
    return this.currentBaseId
      ? this.translationManager.getTranslation(this.currentBaseId)
      : null;
  }

  // Gibt die Anzahl der noch verfügbaren Wörter zurück
  getRemainingWords() {
    return this.availableBaseIds.length;
  }
}
