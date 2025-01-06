import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.container = document.getElementById("prompt-container");
        this.prompt = document.getElementById("prompts");
        this.screen = document.getElementById("gameScreen");
        this.score = document.getElementById("score");
        this.scoreCount = 0;

        this.config = config;
        this.languageHandler = new LanguageHandler(this.config.language);
        this.game = new Game(this.config);
        console.log(this.config);
        this.game.init();

        // Callback für Wortänderungen
        this.game.wordGenerator.setOnWordChangeCallback((newWord) => {
            this.updatePrompt(newWord);
        });

        // Callback für Score-Änderungen
        this.game.setOnScoreChangeCallback((newScore) => {
            this.updateScore(newScore);
        });
    }

    show(onComplete) {
        this.container.style.display = "block";
        this.screen.style.zIndex = "0";
        this.prompt.innerHTML = this.game.wordGenerator.word;
        this.score.innerHTML = this.scoreCount; // Initial Score setzen
        document
            .getElementById("sceneSelectionScreen")
            .addEventListener("click", (event) => {
                const buttonClicked = event.target;
                if (buttonClicked.classList.contains("sceneBtn")) {
                    this.config.selectedScene = event.target.value;
                }
                if (buttonClicked.id == "nextBtn") {
                    onComplete();
                }
            });
    }

    hide() {
        this.container.style.display = "none";
    }

    updatePrompt(newWord) {
        this.prompt.innerHTML = newWord;
    }

    updateScore(newScore) {
        this.score.innerHTML = newScore; // Score im DOM aktualisieren
    }
}
