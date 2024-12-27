import LanguageHandler from "./LanguageHandler";
import Game from "./Game.js"

export default class GameScreen {
    constructor(config) {
        this.container = document.getElementById("prompt-container");
        this.prompt = document.getElementById("prompts"); 
        this.screen = document.getElementById("gameScreen")

        this.config = config;
        this.languageHandler = new LanguageHandler(this.config.language);
        this.game = new Game(this.config); 
        console.log(this.config)
        this.game.init();
    }

    show(onComplete) {
        this.container.style.display = "block";
        this.screen.style.zIndex = "0"; 
        //this.prompt.innerHTML = this.languageHandler.getTranslation(this.game.wordGenerator.word); 
        this.prompt.innerHTML = this.game.wordGenerator.word; 
        document
            .getElementById("sceneSelectionScreen")
            .addEventListener("click", (event) => {
                const buttonClicked = event.target; 
                if(buttonClicked.classist.contains(sceneBtn)) {
                    this.config.selectedScene = event.target.value; 
                }
                if(buttonClicked.id == "nextBtn") {
                    onComplete()
                }
            });
    }

    hide() {
        this.container.style.display = "none"; 
    }



}