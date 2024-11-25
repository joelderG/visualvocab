import SceneSetup from "./SceneSetup.js";
import ModelLoader from "./ModelLoader.js";
import InteractionHandler from "./InteractionHandler.js";
import Animation from "./Animation.js";
import LanguageHandler from "./LanguageHandler.js";
import WordGenerator from "./WordGenerator.js";

export default class App {
  constructor() {
    this.sceneSetup = new SceneSetup();
    this.modelLoader = new ModelLoader(this.sceneSetup.scene);
    this.interactionHandler = new InteractionHandler(
      this.sceneSetup.canvas,
      this.sceneSetup.camera,
      this.sceneSetup.scene
    );
    this.animation = new Animation(
      this.sceneSetup.renderer,
      this.sceneSetup.scene,
      this.sceneSetup.camera
    );
    this.wordGenerator = new WordGenerator();
    this.languageHandler = new LanguageHandler("en", this.wordGenerator.word);

    // Callback für Wortänderungen setzen
    this.wordGenerator.setOnWordChangeCallback((newWord) => {
      this.onWordChange(newWord);
      this.languageHandler.updateWord(newWord);
    });
  }

  /**
   * Reaktion auf Änderungen des Wortes im WordGenerator.
   * Lädt ein neues Objekt und aktualisiert das TargetObject.
   */
  onWordChange(newWord) {
    console.log(`Lade neues Modell für: ${newWord}`);
    this.modelLoader.loadModel(
      "../assets/blender/blender_test_04.gltf",
      newWord,
      (object) => {
        this.interactionHandler.setTargetObject(object);
      }
    );
  }

  /**
   * Initializes the application by loading a model and setting up interactions.
   * Specifies the model's file path and target object name.
   * Starts the animation loop after setup.
   */
  init() {
    this.modelLoader.loadModel(
      "../assets/blender/blender_test_04.gltf",
      this.wordGenerator.word,
      (object) => {
        this.interactionHandler.setTargetObject(object);
      }
    );
    this.animation.start();
  }
}
