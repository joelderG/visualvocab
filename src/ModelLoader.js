// src/ModelLoader.js
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import WordGenerator from "./WordGenerator";

export default class ModelLoader {
    constructor(scene, loadingManager) {
        this.scene = scene;
        this.loader = new GLTFLoader();
        this.model = null;
        this.loadingManager = loadingManager;
        this.objectGroups = new Map(); // Speichert zusammengehörige Meshes
    }

    // Gruppiert zusammengehörige Mesh-Namen
    getBaseObjectName(name) {
        // Entferne Zahlen und Unterstriche am Ende
        return name.split('_')[0];
    }

    loadModel(path, objectName, callback) {
        if (!path) {
            console.error("No path provided to loadModel");
            return;
        }

        console.log("Attempting to load model from path:", path);

        try {
            this.loader.load(
                path,
                (gltf) => {
                    try {
                        console.log("Model loaded successfully:", gltf);
                        this.model = gltf.scene;
                        
                        // Debug: Log scene hierarchy
                        console.log("Scene hierarchy:");
                        this.model.traverse((node) => {
                            console.log("Node:", node.type, node.name);
                        });

                        this.scene.add(this.model);
                        console.log("Model added to scene");

                        if (callback) {
                            callback(this.model);
                        }
                    } catch (error) {
                        console.error("Error processing loaded model:", error);
                    }
                },
                (progress) => {
                    console.log("Loading progress:", (progress.loaded / progress.total * 100) + '%');
                },
                (error) => {
                    console.error("Error loading model:", error);
                }
            );
        } catch (error) {
            console.error("Critical error in model loading:", error);
        }
    }

updateModel(objectName, callback) {
    const baseObjectName = this.getBaseObjectName(objectName);
    const matchingObjects = this.objectGroups.get(baseObjectName);
    
    if (matchingObjects && matchingObjects.length > 0) {
        // Aktualisiere alle zusammengehörigen Meshes
        matchingObjects.forEach(mesh => {
            mesh.material = mesh.material.clone(); // Clone material to avoid affecting other objects
        });
        // Callback mit dem ersten Mesh für weitere Verarbeitung
        callback(matchingObjects[0]);
    }
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
                const seenBaseNames = new Set();
                const nodeNameArray = [];
                
                gltf.scene.traverse((node) => {
                    if (node.isMesh) {
                        const baseName = this.getBaseObjectName(node.name);
                        if (!seenBaseNames.has(baseName) && baseName !== "Scene") {
                            seenBaseNames.add(baseName);
                            nodeNameArray.push(baseName);
                        }
                    }
                });
                
                resolve(nodeNameArray);
            },
            undefined,
            reject
        );
    });
}



}
