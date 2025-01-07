import WordGenerator from "./WordGenerator";
import Scene from "./Scene.js"
import InteractionHandler from "./InteractionHandler.js";
import Animation from "./Animation.js";
import ModelLoader from "./ModelLoader.js";

export default class Game {
    constructor(config) {
        this.config = config;
        console.log(this.config);
        this.scene = new Scene(this.config.selectedScene);
        this.currentObj = null; 
        this.wordGenerator = new WordGenerator(this.config); 
        this.interactionHandler = new InteractionHandler(
            this.scene.canvas,
            this.scene.camera,
            this.scene.scene
          );
          this.animation = new Animation(
            this.scene.renderer,
            this.scene,
            this.scene.camera
          );
        this.scoreCount = 0; 
        this.scene.modelLoader  = new ModelLoader(this.scene.scene, this.wordGenerator)
       
        
            // Callback für Wortänderungen setzen
        this.wordGenerator.setOnWordChangeCallback((newWord) => {
            this.onWordChange(newWord);
      });
    }

   async init(path) {
     await this.setupWordArray(path);
        this.scene.modelLoader.loadModel(
          path,
          this.wordGenerator.word,
          (object) => {
            this.currentObj = object; 
            console.log("init() object: ", this.currentObj)
            this.interactionHandler.setTargetObject(object);
            //object.material = this.scene.shaderMaterial;
    
               // Verzögerte Wortgenerierung nach Objektklick
               this.interactionHandler.setOnCorrectObjectClick(() => {
                this.wordGenerator.onGenerateNewWord(); // Generiere neues Wort
              });
          }
        );
        this.animation.start();
      }

      onWordChange(newWord) {
        //this.currentObj.material = this.scene.defaultMaterial;
        console.log(`Lade neues Modell für: ${newWord}`);
        this.scene.modelLoader.updateModel(
          newWord,
          (object) => {
            this.currentObj = object; 
            //object.material = this.scene.shaderMaterial;
            this.interactionHandler.setTargetObject(object);
             // Callback setzen, wenn das richtige Objekt geklickt wird
             this.interactionHandler.setOnCorrectObjectClick(() => {
              this.wordGenerator.onGenerateNewWord(); // Generiere neues Wort
            });
          }
        );
        console.log(this.scene)
      }

      async setupWordArray(path) {
        try {
            const array = await this.scene.modelLoader.getNodeNamesFromGLTF(path);
            console.log("Node names for word array: ", array);
            this.wordGenerator.setWordArray(array); 
            this.wordGenerator.generateRandomWord();
        } catch (error) {
            console.error("Fehler beim Laden der Node-Namen:", error);
        }
    }
    
    
}