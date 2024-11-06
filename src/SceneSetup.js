import * as THREE from "three";

export default class SceneSetup {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.canvas = document.getElementById("gameCanvas");
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });

        this.setupRenderer();
        this.addLighting();
        this.camera.position.z = 5;
        window.addEventListener("resize", this.onWindowResize.bind(this));
    }

    setupRenderer() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    }

    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1,1,1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
    }

    onWindowResize() {
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
        this.camera.updateProjectionMatrix();
    }

    startRendering() {
        const renderLoop = () => {
            requestAnimationFrame(renderLoop);
            this.renderer.render(this.scene, this.camera);
        };
        renderLoop();
    }
}