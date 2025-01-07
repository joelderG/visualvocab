import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.container = document.getElementById("prompt-container");
        this.prompt = document.getElementById("prompts");
        this.screen = document.getElementById("gameScreen");
        this.scoreCountContainer = document.getElementById("score-count");
        this.score = document.getElementById("score");
        this.totalScore = document.getElementById("total");
        this.scoreCount = 0;
    
        this.config = config;
        this.languageHandler = new LanguageHandler(this.config.language);
        this.game = new Game(this.config);
    
        console.log(this.config);
    
        // Initialisierung des Spiels und Prompts sicherstellen
        this.game.init().then(() => {
            this.totalScore.innerHTML = this.game.wordGenerator.wordArray.length; 
            this.updatePrompt(this.game.wordGenerator.word);
        });
    
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
        this.scoreCountContainer.style.display = "flex"; 
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
        if (newWord) {
            this.prompt.innerHTML = newWord;
        } else {
            this.prompt.innerHTML = "Kein Wort verfügbar!";
        }
    }

    updateScore(newScore) {
        this.score.innerHTML = newScore; // Score im DOM aktualisieren
    }
}
