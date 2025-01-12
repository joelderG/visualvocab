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
        this.game = new Game(this.config);
    
        console.log(this.config);
    
        // Initialisierung des Spiels und Prompts
        this.initializeGame();
    }

    async initializeGame() {
        try {
            await this.game.init();
            
            if (this.game.wordGenerator && this.game.wordGenerator.wordArray) {
                this.totalScore.innerHTML = this.game.wordGenerator.wordArray.length;
                this.updatePrompt(this.game.wordGenerator.word);
            }

            // Callbacks setup
            if (this.game.wordGenerator) {
                this.game.wordGenerator.setOnWordChangeCallback((newWord) => {
                    this.updatePrompt(newWord);
                });
            }

            if (this.game.setOnScoreChangeCallback) {
                this.game.setOnScoreChangeCallback((newScore) => {
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
        
        if (this.game.wordGenerator && this.game.wordGenerator.word) {
            this.prompt.innerHTML = this.game.wordGenerator.word;
        }
        
        this.score.innerHTML = this.scoreCount;

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
        if (this.prompt) {
            this.prompt.innerHTML = newWord || "Kein Wort verfügbar!";
        }
    }

    updateScore(newScore) {
        if (this.score) {
            this.score.innerHTML = newScore;
        }
    }
}