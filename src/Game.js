import WordGenerator from "./WordGenerator";
import Scene from "./Scene.js"
import InteractionHandler from "./InteractionHandler.js";
import Animation from "./Animation.js";

export default class Game {
    constructor(config) {
        this.config = config;
        console.log(this.config);
        this.scene = new Scene(this.config.selectedScene);
        console.log(this.scene)
        this.wordGenerator = new WordGenerator(this.config); 
        this.interactionHandler = new InteractionHandler(
            this.scene.canvas,
            this.scene.camera,
            this.scene.scene
          );
          this.animation = new Animation(
            this.scene.renderer,
            this.scene.scene,
            this.scene.camera
          );
        this.scoreCount = 0; 

            // Callback für Wortänderungen setzen
        this.wordGenerator.setOnWordChangeCallback((newWord) => {
            this.onWordChange(newWord);
      });
    }

    init() {
        this.scene.modelLoader.loadModel(
          `../assets/blender/blender_test_04.gltf`,
          this.wordGenerator.word,
          (object) => {
            this.interactionHandler.setTargetObject(object);
    
               // Verzögerte Wortgenerierung nach Objektklick
               this.interactionHandler.setOnCorrectObjectClick(() => {
                this.wordGenerator.onGenerateNewWord(); // Generiere neues Wort
              });
          }
        );
        this.animation.start();
      }

      onWordChange(newWord) {
        console.log(`Lade neues Modell für: ${newWord}`);
        this.scene.modelLoader.loadModel(
          "../assets/blender/blender_test_04.gltf",
          newWord,
          (object) => {
            this.interactionHandler.setTargetObject(object);
             // Callback setzen, wenn das richtige Objekt geklickt wird
             this.interactionHandler.setOnCorrectObjectClick(() => {
              this.wordGenerator.onGenerateNewWord(); // Generiere neues Wort
            });
          }
        );
      }

    update() {

    }
}