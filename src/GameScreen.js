import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.gameCanvas = document.getElementById("gameCanvas")
        this.container = document.getElementById("game-screen-ui-container");
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
                    if(newScore === 5) {
                        console.log("hello this game is over")
                        this.config.scoreCount = newScore; 
                        this.config.gameFinished = true; 
                        this.onComplete()
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
        
        if (this.game.wordGenerator && this.game.wordGenerator.word) {
            this.prompt.innerHTML = this.game.wordGenerator.word;
        }
        
        this.score.innerHTML = this.scoreCount;

        this.onComplete = onComplete; 
    }

    hide() {
        this.container.style.display = "none";
        this.gameCanvas.style.display = "none";
        this.screen.style.zIndex = "-2";
    }

    updatePrompt(newWord) {
        if (this.prompt) {
            // newWord ist bereits die Übersetzung
            this.prompt.innerHTML = newWord || "Kein Wort verfügbar!";
        }
    }

    updateScore(newScore) {
        if (this.score) {
            this.score.innerHTML = newScore;
        }
    }
}