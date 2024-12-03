export default class DifficultyScreen {
    constructor() {
        this.container = document.getElementById("difficultyScreen");
    }

    show(config, onComplete) {
        this.container.style.display = "block";

        document
            .getElementById("difficultySelector")
            .addEventListener("change", (event) => {
                config.difficulty = event.target.value; // Schwierigkeitsgrad in Konfiguration speichern
                onComplete(); // Zum nächsten Screen wechseln
            });
    }

    hide() {
        this.container.style.display = "none";
    }
}
