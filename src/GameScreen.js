import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js";

export default class GameScreen {
  constructor(config) {
    this.gameCanvas = document.getElementById("gameCanvas");
    this.container = document.getElementById("game-screen-ui-container");
    this.prompt = document.getElementById("prompts");
    this.wrongCount = document.getElementById("wrong");
    this.rightCount = document.getElementById("right"); 
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
            this.totalScore.innerHTML = this.game.totalScore;
        }

        // Callback für Wortänderungen
        if (this.game.wordGenerator) {
            this.game.wordGenerator.setOnWordChangeCallback((newWord) => {
                this.updatePrompt(newWord);
            });
        }

        // Callback für Score-Änderungen
        if (this.game.setOnScoreChangeCallback) {
            this.game.setOnScoreChangeCallback((totalScore, rightCount, wrongCount) => {
                if (totalScore === 0) {
                    this.game.endGame();
                    this.config.wrongCount = wrongCount;
                    console.log("game ended: ", this.game);
                    this.config.scoreCount = rightCount;
                    this.config.gameFinished = true;
                    this.onComplete();
                }
                this.updateScore(rightCount, wrongCount);
                console.log("huhu")
            });
        }
    } catch (error) {
        console.error("Error initializing game screen:", error);
    }
}

  async show(onComplete) {
    this.container.style.display = "block";
    this.screen.style.zIndex = "0";
    this.scoreCountContainer.style.display = "flex";
    this.gameCanvas.style.display = "block";

    this.onComplete = onComplete;

    // Warte auf Initialisierung
    await this.initializeGame();

    // Setze initialen Prompt auf das aktuelle Wort
    if (this.game.wordGenerator) {
      const currentTranslation =
        this.game.wordGenerator.getCurrentTranslation();
      this.updatePrompt(currentTranslation);
    }
  }

    hide() {
      this.score.innerHTML = 0; 
      this.rightCount.innerHTML = 0;
      this.wrongCount.innerHTML = 0;
      document.getElementById("hint-btn").removeAttribute("disabled");
      document.getElementById("tooltiptext").innerHTML = "Get a hint!"
      this.container.style.display = "none"; 
      this.screen.style.zIndex = "-2";
      console.log("hide")
    }

  updatePrompt(newWord) {
    if (this.prompt) {
      console.log("Updating prompt with:", newWord); // Debug log
      this.prompt.innerHTML = newWord || "Kein Wort verfügbar!";
    } else {
      console.error("Prompt element not found!"); // Debug log
    }
  }

  updateScore(right, wrong) {
    if (this.rightCount) {
        this.rightCount.innerHTML = right;
    }

    if (this.wrongCount) {
        this.wrongCount.innerHTML = wrong;
    }

    if(this.score) {
      this.score.innerHTML = right + wrong; 
    }
}
}
