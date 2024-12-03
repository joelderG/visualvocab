import App from "/src/App.js";
import ScreenManager from "./src/ScreenManager";

document.addEventListener("DOMContentLoaded", () => {

  const screenManager = new ScreenManager();
  console.log("helloS");
  screenManager.nextScreen();
});
