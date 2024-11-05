// Importiere Three.js und den GLTFLoader
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () => {
    // Grundlegende Initialisierung von Three.js
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    // Zuweisen des Canvas auf das in der index.html erstellte Element
    const canvas = document.getElementById("gameCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Beleuchtung der Szene
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    let sofaObject = null; // Referenz für das Sofa-Objekt

    // Lade das GLTF-Modell und füge es zur Szene hinzu
    const loader = new GLTFLoader();
    loader.load('assets/interior_scene_gltf/scene.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        // Suche nach dem Sofa-Objekt
        model.traverse((node) => {
            if (node.isMesh && node.name.includes("PM3D_sofa")) {
                sofaObject = node; // Referenz für Sofa speichern
                console.log("Sofa gefunden:", sofaObject);
            }
        });
    });

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    // Fenstergrößenanpassung
    window.addEventListener("resize", () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    // Klick-Interaktion hinzufügen
    canvas.addEventListener("click", (event) => {
        if (!sofaObject) return;
    
        // Raycaster für Klick-Events
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2(
            (event.clientX / canvas.clientWidth) * 2 - 1,
            -(event.clientY / canvas.clientHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouse, camera);
    
        // Prüfen, ob das Sofa angeklickt wurde
        const intersects = raycaster.intersectObject(sofaObject, true);
        if (intersects.length > 0) {
            console.log("Sofa wurde angeklickt!");
            sofaObject.material.color.set(0x00ff00); // Setzt die Farbe des Sofas auf Grün
        }
    });

    // Starten der Animation
    animate();
});