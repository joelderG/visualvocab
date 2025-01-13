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
    if (!path || !objectName) {
        console.error("Invalid path or objectName provided to loadModel");
        return;
    }

    console.log("Loading model, searching for object:", objectName);

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
                    
                    // Gruppiere zusammengehörige Meshes
                    this.objectGroups.clear();
                    this.model.traverse((node) => {
                        if (node.isMesh) {
                            const baseObjectName = this.getBaseObjectName(node.name);
                            if (!this.objectGroups.has(baseObjectName)) {
                                this.objectGroups.set(baseObjectName, []);
                            }
                            this.objectGroups.get(baseObjectName).push(node);
                        }
                    });

                    // Suche nach dem passenden Objekt
                    const baseSearchName = this.getBaseObjectName(objectName);
                    const matchingObjects = this.objectGroups.get(baseSearchName);
                    
                    if (matchingObjects && matchingObjects.length > 0) {
                        console.log(`Found ${matchingObjects.length} parts for object ${baseSearchName}`);
                        // Gib das erste Mesh zurück, aber behalte die Gruppe für spätere Updates
                        callback(matchingObjects[0]);
                    } else {
                        console.warn(`No matching objects found for ${baseSearchName}`);
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
                if (this.loadingManager) {
                    const loadProgress = (xhr.loaded / xhr.total) * 100;
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
