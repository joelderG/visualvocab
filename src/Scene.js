import * as THREE from "three";
import ModelLoader from "./ModelLoader.js";
import vertexShader from "./shaders/vertex.glsl.js"
import fragmentShader from "./shaders/fragment.glsl.js";

export default class Scene {
    constructor(sceneName, config) {  // Add config parameter
        this.sceneName = sceneName;
        this.config = config;  // Store config
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x579BCF); // Hellblauer Himmel
        
        // Get camera settings for this scene
        const cameraSettings = this.config.getCameraSettings();
        
        this.camera = new THREE.PerspectiveCamera(
            cameraSettings.fov,
            window.innerWidth / window.innerHeight,
            cameraSettings.near,
            cameraSettings.far
        );

        // Apply camera position and rotation
        this.camera.position.set(
            cameraSettings.position.x,
            cameraSettings.position.y,
            cameraSettings.position.z
        );
        
        this.camera.rotation.set(
            cameraSettings.rotation.x,
            cameraSettings.rotation.y,
            cameraSettings.rotation.z
        );

        // Make camera look at specific point
        if (cameraSettings.lookAt) {
            this.camera.lookAt(
                new THREE.Vector3(
                    cameraSettings.lookAt.x,
                    cameraSettings.lookAt.y,
                    cameraSettings.lookAt.z
                )
            );
        }

        this.placeholder = document.getElementById("gameScreen-placeholder");
        this.canvas = document.getElementById("gameCanvas");
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
        });
        
        this.modelLoader = null;
        this.defaultMaterial = new THREE.MeshStandardMaterial();
        this.shaderMaterial = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uRadius: { value: 0.5 }
            }
        });

        this.setupRenderer();
        this.addLighting();
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    addLighting() {
        // Sanftes Umgebungslicht für Schatten
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        this.scene.add(ambientLight);
    
        // Hauptsonnenlicht
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.5);
        sunLight.position.set(50, 50, 10); // Sonnenlicht von oben-rechts
        sunLight.castShadow = true;
    
        // Verbesserte Schattenqualität
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.normalBias = 0.02;
    
        // Sekundäres Sonnenlicht für weichere Schatten
        const secondarySunLight = new THREE.DirectionalLight(0xffd2a1, 0.5); // Wärmeres Licht
        secondarySunLight.position.set(-30, 30, -10);
    
        this.scene.add(sunLight);
        this.scene.add(secondarySunLight);
    
        // Aktiviere Schatten im Renderer
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    onWindowResize() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    updateCameraSettings() {
        const settings = this.config.getCameraSettings();
        this.camera.position.set(settings.position.x, settings.position.y, settings.position.z);
        this.camera.rotation.set(settings.rotation.x, settings.rotation.y, settings.rotation.z);
        if (settings.lookAt) {
            this.camera.lookAt(
                new THREE.Vector3(settings.lookAt.x, settings.lookAt.y, settings.lookAt.z)
            );
        }
        this.camera.fov = settings.fov;
        this.camera.near = settings.near;
        this.camera.far = settings.far;
        this.camera.updateProjectionMatrix();
    }

    disposeScene() {
        this.scene.traverse((object) => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                // Überprüfen, ob das Material ein Array ist
                if (Array.isArray(object.material)) {
                    object.material.forEach((material) => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
            if (object.texture) {
                object.texture.dispose();
            }
        });

        if (this.renderer) {
            this.renderer.dispose(); // Ressourcen wie Texturen, Geometrien etc. freigeben
        }

        this.placeholder.parentNode.insertBefore(this.canvas, this.placeholder);
        
        if (this.canvas) {
            const parent = this.canvas.parentElement;
            if (parent) {
                parent.removeChild(this.canvas); // Entferne das <canvas> aus dem DOM
            }
            this.canvas = null; // Verweis auf das Canvas aufheben
        }

        this.replaceCanvas(); 
    
    }

    replaceCanvas() {
        // Neues Canvas erstellen und dem DOM hinzufügen
   
        this.canvas = document.createElement("canvas");
        this.canvas.id = "gameCanvas";
        this.placeholder.replaceWith(this.canvas);
        this.placeholder = document.createElement("div");
        this.placeholder.id = "gameScreen-placeholder"
        // Neues Placeholder-Element vor dem Canvas einfügen
    this.canvas.insertAdjacentElement("beforebegin", this.placeholder);
    }
    
}