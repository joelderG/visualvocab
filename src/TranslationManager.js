// TranslationManager.js
import livingRoomTranslations from '../translations/translation-livingroom.json';
import bedroomTranslations from '../translations/translation-bedroom.json';
import shapesTranslations from '../translations/translation-shapes.json';

export default class TranslationManager {
    constructor(config) {
        this.config = config;
        this.translations = null;
        this.objectGroups = new Map(); // Speichert zusammengehörige Objekte
    }

    // Lädt die Übersetzungen für die ausgewählte Szene
    async loadTranslations(sceneName) {
        try {
            // Hier würden wir die entsprechende JSON-Datei laden
            // Beispiel: const response = await fetch(`translations-${sceneName}.json`);
            // this.translations = await response.json();
            
            return true;
        } catch (error) {
            console.error('Error loading translations:', error);
            return false;
        }
    }

    // Normalisiert einen Objektnamen (entfernt Zahlen und Unterstriche am Ende)
    normalizeObjectName(name) {
        return name.split('_')[0].toLowerCase();
    }

    // Gruppiert Objekte mit ähnlichen Namen
    registerObject(object) {
        if (!object.name) return;
        
        const baseName = this.normalizeObjectName(object.name);
        
        if (!this.objectGroups.has(baseName)) {
            this.objectGroups.set(baseName, []);
        }
        
        this.objectGroups.get(baseName).push(object);
    }

    // Prüft ob ein angeklicktes Objekt zu einer Gruppe gehört
    isObjectInGroup(clickedObject, groupName) {
        const group = this.objectGroups.get(this.normalizeObjectName(groupName));
        return group && group.includes(clickedObject);
    }

    // Holt die Übersetzung für einen normalisierten Objektnamen
    getTranslation(objectName) {
        if (!this.translations || !this.config.language) {
            return objectName;
        }

        const normalizedName = this.normalizeObjectName(objectName);
        const languageTranslations = this.translations[this.config.language];
        
        return languageTranslations?.[normalizedName] || normalizedName;
    }

    // Holt alle verfügbaren Objektgruppen
    getAvailableObjects() {
        return Array.from(this.objectGroups.keys());
    }

    // Holt alle Objekte einer Gruppe
    getObjectsInGroup(groupName) {
        return this.objectGroups.get(this.normalizeObjectName(groupName)) || [];
    }
}