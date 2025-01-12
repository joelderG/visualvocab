import * as THREE from "three";
import ModelLoader from "./ModelLoader.js";
import vertexShader from "./shaders/vertex.glsl.js"
import fragmentShader from "./shaders/fragment.glsl.js";

export default class Scene {
    constructor(sceneName, config) {  // Add config parameter
        this.sceneName = sceneName;
        this.config = config;  // Store config
        this.scene = new THREE.Scene();
        
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
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
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
}