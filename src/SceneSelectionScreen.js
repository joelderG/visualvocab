export default class SceneSelectionScreen {
    constructor(config) {
        this.container = document.getElementById("sceneSelectionScreen");
        this.config = config; 
    }

    show(onComplete) {
        this.onComplete = onComplete; 
        this.container.style.display = "block";
        this.container.addEventListener("click", this.handleEvent);
    }

    handleEvent = (event) => {
        const buttonClicked = event.target; 
        if(buttonClicked.classList.contains("sceneBtn")) {
            this.config.selectedScene = event.target.value; 
            console.log("SelectedScene: " + event.target.value);
            this.config.setPath(this.config.selectedScene);
            console.log(event.target.value)
        }
        if(buttonClicked.id == "nextBtn") {
            this.onComplete()
        }
    }

    hide() {
        this.container.removeEventListener("click", this.handleEvent)
        this.container.style.display = "none"; 
        
    }



}