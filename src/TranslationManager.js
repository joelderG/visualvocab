import livingRoomTranslations from "../translations/translation-livingroom.json";
import bedroomTranslations from "../translations/translation-witch.json";
import shapesTranslations from "../translations/translation-shapes.json";

export default class TranslationManager {
  constructor(config) {
    this.config = config;
    this.translations = null;
  }

  // Lädt die entsprechende Übersetzungsdatei basierend auf der Szene
  loadTranslations(sceneName) {
    switch (sceneName) {
      case "scene1":
        this.translations = livingRoomTranslations;
        break;
      case "scene2":
        this.translations = bedroomTranslations;
        break;
      case "scene3":
        this.translations = shapesTranslations;
        break;
      default:
        console.error("Unknown scene:", sceneName);
        return false;
    }
    return true;
  }

  // Gibt alle verfügbaren Basis-IDs zurück (für die Wortauswahl)
  getAllBaseIds() {
    return Object.keys(this.translations.mappings);
  }

  // Holt die Übersetzung für eine Basis-ID in der aktuellen Sprache
  getTranslation(baseId) {
    if (!this.translations || !this.config.language) {
      return baseId;
    }
    return this.translations[this.config.language][baseId] || baseId;
  }

  // Prüft ob ein Objektname zu einer Basis-ID gehört
  isObjectInGroup(objectName, baseId) {
    if (!this.translations.mappings[baseId]) {
      return false;
    }
    return this.translations.mappings[baseId]
      .map((name) => name.toLowerCase())
      .includes(objectName.toLowerCase());
  }

  // Findet die Basis-ID für einen Objektnamen
  findBaseIdForObject(objectName) {
    const entries = Object.entries(this.translations.mappings);
    const found = entries.find(([_, names]) =>
      names.map((name) => name.toLowerCase()).includes(objectName.toLowerCase())
    );
    return found ? found[0] : null;
  }

  // Debug-Methode
  logAvailableObjects() {
    console.log("Available objects for current scene:");
    console.log("Base IDs:", this.getAllBaseIds());
    console.log("Current language:", this.config.language);
    this.getAllBaseIds().forEach((baseId) => {
      console.log(`${baseId}:`, {
        translation: this.getTranslation(baseId),
        mappings: this.translations.mappings[baseId],
      });
    });
  }
}
