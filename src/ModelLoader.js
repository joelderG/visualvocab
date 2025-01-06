// src/ModelLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WordGenerator from "./WordGenerator";

export default class ModelLoader {
  constructor(scene) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.model = null; 
    this.nodeNameArray = []; 
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
    

      // searching for a modell which contains the "objectName" in it
      this.model.traverse((node) => {
  
       // node.material = this.scene.defaultMaterial; 
        if (node.isMesh && node.name.includes(objectName)) {
          callback(node); // gives the object in a callback function
        }
      });
    });
  }

  updateModel(objectName, callback) {
    // searching for a modell which contains the "objectName" in it
    this.model.traverse((node) => {

      if (node.isMesh && node.name.includes(objectName)) {
        callback(node); // gives the object in a callback function
      }
    });
  }


collectNodeNames(gltfScene) {
    const nodeNames = [];

    // Rekursive Funktion, um alle Nodes zu durchsuchen
    function traverseNode(node) {
        if (node.name) {
            nodeNames.push(node.name); // Füge den Namen hinzu, falls vorhanden
        }
        if (node.children) {
            node.children.forEach((child) => traverseNode(child)); // Durchlaufe alle Kinder
        }
    }

    // Beginne die Traversierung mit der Root der Szene
    traverseNode(gltfScene);

    return nodeNames;
}

// Beispiel für das Laden eines GLTF-Modells und Abrufen der Node-Namen
getNodeNamesFromGLTF(url) {
    return new Promise((resolve, reject) => {
        this.loader.load(
            url,
            (gltf) => {
                const nodeNameArray = [];
                gltf.scene.traverse((node) => {
                    if (node.name) {
                        nodeNameArray.push(node.name); // Nur Nodes mit Namen hinzufügen
                    }
                });
                resolve(nodeNameArray); // Ergebnis zurückgeben
            },
            undefined,
            (error) => {
                reject(error); // Fehlerbehandlung
            }
        );
    });
}



}
