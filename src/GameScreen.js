import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.gameCanvas = document.getElementById("gameCanvas");
        this.container = document.getElementById("game-screen-ui-container");
        this.prompt = document.getElementById("prompts");
        this.screen = document.getElementById("gameScreen");
        this.scoreCountContainer = document.getElementById("score-count");
        this.score = document.getElementById("score");
        this.totalScore = document.getElementById("total");
        this.scoreCount = 0;
    
        this.config = config;
        this.game = new Game(this.config);
    }

    async initializeGame() {
        try {
            await this.game.init();
            
            // Setze initial den Total Score
            if (this.game.wordGenerator) {
                this.totalScore.innerHTML = this.game.wordGenerator.getRemainingWords();
            }

            // Callback für Wortänderungen
            if (this.game.wordGenerator) {
                this.game.wordGenerator.setOnWordChangeCallback((newWord) => {
                    this.updatePrompt(newWord);
                });
            }

            // Callback für Score-Änderungen
            if (this.game.setOnScoreChangeCallback) {
                this.game.setOnScoreChangeCallback((newScore) => {
                    if(newScore === 5) {
                        this.config.scoreCount = newScore; 
                        this.config.gameFinished = true; 
                        this.onComplete();
                    }
                    this.updateScore(newScore);
                });
            }
        } catch (error) {
            console.error("Error initializing game screen:", error);
        }
    }

    show(onComplete) {
        this.container.style.display = "block";
        this.screen.style.zIndex = "0";
        this.scoreCountContainer.style.display = "flex";
        this.gameCanvas.style.display = "block";  // Make sure canvas is visible
        
        this.onComplete = onComplete;
        this.initializeGame();
    }

    hide() {
        this.container.style.display = "none";
        this.gameCanvas.style.display = "none";
        this.screen.style.zIndex = "-2";
    }

    updatePrompt(newWord) {
        if (this.prompt) {
            console.log("Updating prompt with:", newWord);  // Debug log
            this.prompt.innerHTML = newWord || "Kein Wort verfügbar!";
        } else {
            console.error("Prompt element not found!");  // Debug log
        }
    }

    updateScore(newScore) {
        if (this.score) {
            this.score.innerHTML = newScore;
        }
    }
}