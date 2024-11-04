// Importiere Three.js und den GLTFLoader
import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

document.addEventListener("DOMContentLoaded", () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

    const canvas = document.getElementById("gameCanvas");
    const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let model;  // Variable zum Speichern des geladenen Modells
    loader.load(
        'assets/my_armchair_glb/scene.glb',
        (gltf) => {
            model = gltf.scene;
            scene.add(model);
            model.scale.set(1, 1, 1);
            model.position.set(0, 0, 0);
        },
        undefined,
        (error) => {
            console.error("Ein Fehler beim Laden des GLTF-Modells ist aufgetreten:", error);
        }
    );

    camera.position.z = 4;

    // Variablen für die Mausinteraktion
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    // Event-Listener für die Maus
    canvas.addEventListener("mousedown", (e) => {
        if (e.button === 0) {  // Nur die linke Maustaste
            isDragging = true;
        }
    });

    canvas.addEventListener("mousemove", (e) => {
        if (isDragging && model) {
            const deltaMove = {
                x: e.clientX - previousMousePosition.x,
                y: e.clientY - previousMousePosition.y
            };

            // Rotation in Abhängigkeit von Mausbewegung berechnen
            const rotationSpeed = 0.01;
            model.rotation.y += deltaMove.x * rotationSpeed;
            model.rotation.x += deltaMove.y * rotationSpeed;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        }
    });

    canvas.addEventListener("mouseup", (e) => {
        if (e.button === 0) {
            isDragging = false;
        }
    });

    // Initiale Mausposition festlegen, wenn die Maus gedrückt wird
    canvas.addEventListener("mousedown", (e) => {
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }

    window.addEventListener("resize", () => {
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    });

    animate();
});