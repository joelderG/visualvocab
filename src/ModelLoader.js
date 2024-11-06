// src/ModelLoader.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default class ModelLoader {
    constructor(scene) {
        this.scene = scene;
        this.loader = new GLTFLoader();
    }

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