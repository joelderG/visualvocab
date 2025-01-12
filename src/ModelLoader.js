// src/ModelLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WordGenerator from "./WordGenerator";

export default class ModelLoader {
  constructor(scene, loadingManager) {
    this.scene = scene;
    this.loader = new GLTFLoader();
    this.model = null;
    this.loadingManager = loadingManager;
}

loadModel(path, objectName, callback) {
    if (!path || !objectName) {
        console.error("Invalid path or objectName provided to loadModel");
        return;
    }

    if (this.loadingManager) {
        this.loadingManager.show(`Loading ${objectName}...`);
    }

    try {
        this.loader.load(
            path,
            (gltf) => {
                try {
                    this.model = gltf.scene;
                    this.scene.add(this.model);
                    
                    let objectFound = false;
                    this.model.traverse((node) => {
                        if (node.isMesh && node.name.includes(objectName)) {
                            objectFound = true;
                            callback(node);
                        }
                    });

                    if (!objectFound) {
                        console.warn(`Object with name ${objectName} not found in model`);
                    }

                    if (this.loadingManager) {
                        this.loadingManager.hide();
                    }
                } catch (error) {
                    console.error("Error processing loaded model:", error);
                    if (this.loadingManager) {
                        this.loadingManager.hide();
                    }
                }
            },
            (xhr) => {
                const loadProgress = (xhr.loaded / xhr.total) * 100;
                if (this.loadingManager) {
                    this.loadingManager.setProgress(loadProgress);
                    this.loadingManager.setMessage(
                        `Loading Scene... ${Math.round(loadProgress)}%`
                    );
                }
            },
            (error) => {
                console.error("Error loading model:", error);
                if (this.loadingManager) {
                    this.loadingManager.hide();
                }
            }
        );
    } catch (error) {
        console.error("Critical error in model loading:", error);
        if (this.loadingManager) {
            this.loadingManager.hide();
        }
    }
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
                      if (node.name != "Scene") {
                        nodeNameArray.push(node.name); // Nur Nodes mit Namen hinzufügen
                      } 
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
