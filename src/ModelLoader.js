// src/ModelLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

    /**
     * Loads a GLTF model from the specified path, adds it to the scene, and finds
     * a specific target object within the model based on the given object name.
     * Passes the found object to the callback function for further use.
     *
     * @param {string} path - Path to the GLTF model file.
     * @param {string} objectName - Name or identifier of the target object to locate.
     * @param {function} callback - Callback function that receives the found object.
    */
    loadModel(path, objectName, callback) {
        this.loader.load(path, (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);

            // searching for a modell which contains the "objectName" in it
            model.traverse((node) => {
                if (node.isMesh && node.name.includes(objectName)) {
                    callback(node); // gives the object in a callback function
                }
            });
        });
    }
}