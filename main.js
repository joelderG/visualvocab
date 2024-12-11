import App from "/src/App_new.js";
import Configuration from "./src/Configuration.js";

document.addEventListener("DOMContentLoaded", () => {

  const configuration = new Configuration(); 
  const app = new App(configuration);
  app.start(); 
});
