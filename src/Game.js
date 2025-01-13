import WordGenerator from "./WordGenerator.js";  // .js hinzugefügt
import Scene from "./Scene.js";
import InteractionHandler from "./InteractionHandler.js";
import Animation from "./Animation.js";
import ModelLoader from "./ModelLoader.js";
import LoadingManager from "./LoadingManager.js";
import TranslationManager from "./TranslationManager.js";

export default class Game {
    constructor(config) {
        if (!config) {
            throw new Error("Game configuration is required");
        }

        try {
            this.config = config;
            this.loadingManager = new LoadingManager();
            this.scene = new Scene(this.config.selectedScene, this.config);
            this.translationManager = new TranslationManager(this.config);
            this.wordGenerator = new WordGenerator(this.config, this.translationManager);
            
            if (!this.scene.canvas) {
                throw new Error("Canvas element not found");
            }

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

            this.currentObj = null;
            this.scoreCount = 0;
            this.scene.modelLoader = new ModelLoader(this.scene.scene, this.loadingManager);
            this.scoreChangeCallback = null;

            // WICHTIG: Wir registrieren hier den Word-Change-Callback
            this.wordGenerator.setOnWordChangeCallback((newWord) => this.onWordChange(newWord));

            this.setupEventHandlers();
        } catch (error) {
            console.error("Error initializing game:", error);
            this.handleGameError(error);
        }
    }

    setupEventHandlers() {
        this.wordGenerator.setOnWordChangeCallback((newWord) => {
            try {
                this.onWordChange(newWord);
            } catch (error) {
                console.error("Error in word change handler:", error);
            }
        });

        // Globaler Error Handler für unerwartete Fehler
        window.addEventListener('error', (event) => {
            console.error("Global error:", event.error);
            this.handleGameError(event.error);
        });
    }

    async init() {
        try {
            this.loadingManager.show("Initializing game...");
            
            // Initialisiere den WordGenerator (lädt auch Übersetzungen)
            await this.wordGenerator.init();
            
            await this.setupWordArray(this.config.path);
            
            if (this.wordGenerator.wordArray.length > 0) {
                this.wordGenerator.generateRandomWord();
            }

            await new Promise((resolve, reject) => {
                this.scene.modelLoader.loadModel(
                    this.config.path,
                    this.wordGenerator.getCurrentWord(), // Original-Wort für die Modell-Suche
                    (object) => {
                        try {
                            console.log("Loading model with original word:", this.wordGenerator.getCurrentWord());
                            this.currentObj = object;
                            this.interactionHandler.setTargetObject(object);
                            this.setupInteractionHandlers();
                            resolve();
                        } catch (error) {
                            reject(error);
                        }
                    }
                );
            });

            this.animation.start();
        } catch (error) {
            console.error("Error initializing game:", error);
            this.loadingManager.hide();
        }
    }

    setupInteractionHandlers() {
        this.interactionHandler.setOnCorrectObjectClick(() => {
            try {
                this.incrementScore();
                this.wordGenerator.onGenerateNewWord();
            } catch (error) {
                console.error("Error in interaction handler:", error);
            }
        });

        this.interactionHandler.setOnWrongObjectClick(() => {
            console.log("not the right object");
            this.wordGenerator.onGenerateNewWord();
        });

        this.interactionHandler.setOnSkipClick(() => {
            this.wordGenerator.onGenerateNewWord();
        });
    }

    async onWordChange(newWord) {
        console.log("Word changed to:", newWord); // Debug output

        if (!newWord) {
            console.warn("Invalid word received in onWordChange");
            return;
        }

        try {
            // Holen das Original-Wort, nicht die Übersetzung
            const originalWord = this.wordGenerator.getCurrentWord();
            console.log("Searching for object with name:", originalWord); // Debug output

            this.scene.modelLoader.updateModel(
                originalWord,
                (object) => {
                    if (!object) {
                        throw new Error("No object returned from model update");
                    }
                    this.currentObj = object;
                    console.log("Setting new target object:", object.name); // Debug output
                    this.interactionHandler.setTargetObject(object);
                }
            );
        } catch (error) {
            console.error("Error changing word:", error);
            this.handleGameError(error);
        }
    }


    async setupWordArray(path) {
        if (!path) {
            throw new Error("No path provided for word array setup");
        }

        try {
            const array = await this.scene.modelLoader.getNodeNamesFromGLTF(path);
            if (!array || array.length === 0) {
                throw new Error("No valid nodes found in model");
            }
            this.wordGenerator.setWordArray(array);
        } catch (error) {
            console.error("Error setting up word array:", error);
            throw error; // Weitergabe an übergeordneten Handler
        }
    }

    handleGameError(error) {
        // Hier könnte UI-Feedback implementiert werden
        console.error("Game error occurred:", error);
        
        // Versuche grundlegende Wiederherstellung
        if (!this.isInitialized) {
            // Wenn der Fehler während der Initialisierung auftritt
            console.log("Attempting to recover from initialization error...");
            // Hier könnte ein Retry-Mechanismus implementiert werden
        }
    }

  setOnScoreChangeCallback(callback) {
      this.scoreChangeCallback = callback;
  }

  incrementScore() {
      this.scoreCount++;
      console.log("Score updated in Game:", this.scoreCount);
      if (this.scoreChangeCallback) {
          this.scoreChangeCallback(this.scoreCount);
      }
  }
}