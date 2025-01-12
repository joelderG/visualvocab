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
        this.scoreChangeCallback = null;
       
        
            // Callback für Wortänderungen setzen
        this.wordGenerator.setOnWordChangeCallback((newWord) => {
            this.onWordChange(newWord);
      });

      this.setOnScoreCallback
    }

    async init() {
      await this.setupWordArray();
      if (this.wordGenerator.wordArray.length > 0) {
          this.wordGenerator.generateRandomWord();
      }
  
      this.scene.modelLoader.loadModel(
          `../assets/blender_room/blender_room.gltf`,
          this.wordGenerator.word,
          (object) => {
              this.currentObj = object;
              console.log("init() object: ", this.currentObj);
              this.interactionHandler.setTargetObject(object);
  
              // Verzögerte Wortgenerierung nach Objektklick
              this.interactionHandler.setOnCorrectObjectClick(() => {
                  this.incrementScore();
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
              this.incrementScore(); 
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
        } catch (error) {
            console.error("Fehler beim Laden der Node-Namen:", error);
        }
    }

    setOnScoreChangeCallback(callback) {
      this.scoreChangeCallback = callback;
  }

  incrementScore() {
    this.scoreCount++;
    console.log("Score updated in Game:", this.scoreCount);
    if (this.scoreChangeCallback) {
        this.scoreChangeCallback(this.scoreCount); // Callback aufrufen
    }
}
    
    
}