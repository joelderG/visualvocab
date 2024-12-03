export default class LanguageScreen {
    constructor() {
        this.container = document.getElementById("languageScreen");
    }

    show(config, onComplete) {
        this.container.style.display = "block";

        document
            .getElementById("languageSelector")
            .addEventListener("change", (event) => {
                config.language = event.target.value; // Sprache in Konfiguration speichern
                onComplete(); // Zum nächsten Screen wechseln
            });
    }

    hide() {
        this.container.style.display = "none";
    }
}
