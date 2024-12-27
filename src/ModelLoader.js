// src/ModelLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.model = null; 
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
      this.model = gltf.scene;
      this.scene.add(this.model);
      console.log(this.model.children)

      // searching for a modell which contains the "objectName" in it
      this.model.traverse((node) => {
        console.log(node.name)
        if (node.isMesh && node.name.includes(objectName)) {
          callback(node); // gives the object in a callback function
        }
      });
    });
  }

  updateModel(objectName, callback) {
    // searching for a modell which contains the "objectName" in it
    this.model.traverse((node) => {
      console.log(node.name)
      if (node.isMesh && node.name.includes(objectName)) {
        callback(node); // gives the object in a callback function
      }
    });
  }
}
