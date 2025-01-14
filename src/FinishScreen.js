import Configuration from "./Configuration";

export default class FinishScreen {
    constructor(config, resetConfig) {
        this.container = document.getElementById("endScreen");
        this.finalScore = document.getElementById("final-score");
        this.wrongCount = document.getElementById("wrong-count"); 
        this.config = config; 
        this.resetConfig = resetConfig; 

    }

    show(onComplete) {
        this.container.style.display = "block";
        this.finalScore.innerHTML = `Your score: ${this.config.scoreCount}`;
        this.wrongCount.innerHTML = `Wrong words: ${this.config.wrongCount}`; 

        this.container.addEventListener('click', (event) => {   
            if (event.target.id == "newGame") {
                    console.log("new game")
                    this.resetConfig(); 
                    onComplete(); 
                }
            });
          
    
    }

    hide() {
        console.log("hide", this.config)
        this.container.style.display = "none";
        this.container.style.zIndex = "0"; 


    }
}
