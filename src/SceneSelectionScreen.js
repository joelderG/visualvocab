export default class SceneSelectionScreen {
    constructor(config) {
        this.container = document.getElementById("sceneSelectionScreen");
        this.config = config; 
        this.previouslySelectedButton = null;
    }

    show(onComplete) {
        this.onComplete = onComplete; 
        this.container.style.display = "block";
        this.container.addEventListener("click", this.handleEvent);
    }

    handleEvent = (event) => {
        const buttonClicked = event.target; 
          // Entferne die 'selected'-Klasse vom vorherigen Button
          if (this.previouslySelectedButton) {
            this.previouslySelectedButton.classList.remove('selected');
        }

        // Füge die 'selected'-Klasse zum aktuellen Button hinzu
        buttonClicked.classList.add('selected');

        // Aktualisiere den vorherigen Button
        this.previouslySelectedButton = buttonClicked;
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