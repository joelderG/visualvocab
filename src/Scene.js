import * as THREE from "three";
import ModelLoader from "./ModelLoader.js";

export default class Scene {
    constructor(sceneName) {
        this.sceneName = sceneName; 
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
          );
          this.canvas = document.getElementById("gameCanvas");
          this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
          });
        this.modelLoader = new ModelLoader(this.scene)
      
          this.setupRenderer();
          this.addLighting();
          this.camera.position.z = 10;
          window.addEventListener("resize", this.onWindowResize.bind(this));
    }

      /**
   * Configures the renderer's size to match the dimensions of the canvas element.
   */
  setupRenderer() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
  }

    /**
   * Adds ambient and directional lighting to the scene for basic illumination.
   * Ambient light is set with moderate intensity, while directional light is positioned.
   */
    addLighting() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(1, 1, 1);
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);
      }

        /**
   * Adjusts renderer and camera aspect ratio to maintain correct scene proportions
   * after window resizing.
   */
  onWindowResize() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.updateProjectionMatrix();
  }

}