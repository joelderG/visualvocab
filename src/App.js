import SceneSetup from "./SceneSetup.js"
import ModelLoader from "./ModelLoader.js"
import InteractionHandler from "./InteractionHandler.js"
import Animation from "./Animation.js";

export default class App {
    constructor() {
        this.sceneSetup = new SceneSetup();
        this.modelLoader = new ModelLoader(this.sceneSetup.scene);
        this.interactionHandler = new InteractionHandler(this.sceneSetup.canvas, this.sceneSetup.camera);
        this.animation = new Animation(this.sceneSetup.renderer, this.sceneSetup.scene, this.sceneSetup.camera);
    }

    init() {
        this.modelLoader.loadModel('../assets/interior_scene_gltf/scene.gltf', "PM3D_sofa", (object) => {
            this.interactionHandler.setTargetObject(object);
        });
        this.animation.start(); // starts the animation loop
    }
}