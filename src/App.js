import ScreenManager from "./ScreenManager";
import Configuration from "./Configuration";

export default class App {
    constructor(configuration){
        this.screenManager = new ScreenManager(configuration);
    }

    start() {
        this.screenManager.nextScreen(); 
    }
}