export default class GameCompleteScreen {
    constructor() {
        this.container = document.getElementById("gameCompleteScreen");
    }

    show() {
        console.log("game complete")
        this.container.style.display = "block";
    }

    hide() {
        this.container.style.display = "none";
    }
}
