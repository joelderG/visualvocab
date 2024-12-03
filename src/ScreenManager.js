import LanguageScreen from "./LanguageScreen";
import DifficultyScreen from "./DifficultyScreen";
import App from "./App";

export default class ScreenManager {

    constructor() {
        this.currentScreen = null;
        this.config = {
            language: null,
            difficulty: null
        };
    }

    // Wechselt den aktuellen Screen
    changeScreen(newScreen) {
        if (this.currentScreen) {
            this.currentScreen.hide(); // Vorherigen Screen ausblenden
        }

        this.currentScreen = newScreen;
        this.currentScreen.show(this.config, () => this.nextScreen());
    }

    // Wechselt zum nächsten Zustand basierend auf der Konfiguration
    nextScreen() {
        if (!this.config.language) {
            this.changeScreen(new LanguageScreen());
        } else if (!this.config.difficulty) {
            this.changeScreen(new DifficultyScreen());
        } else {
            this.changeScreen(new App());
        }
    }
}
