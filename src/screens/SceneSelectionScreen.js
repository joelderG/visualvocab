export default class SceneSelectionScreen {
    constructor(config) {
        this.container = document.getElementById("sceneSelectionScreen");
        this.config = config; 
        this.scenes = []
        this.selectedScene = null; 
    }

    show(onComplete) {
        this.container.style.display = "block";

        document
            .getElementById("sceneSelectionScreen")
            .addEventListener("click", (event) => {
                const buttonClicked = event.target; 
                if(buttonClicked.classList.contains("sceneBtn")) {
                    this.config.selectedScene = event.target.value; 
                    console.log(event.target.value)
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