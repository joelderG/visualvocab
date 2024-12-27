import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl.js"
import fragmentShader from "./shaders/fragment.glsl.js";

export default class InteractionHandler {
  /**
   * Initializes the interaction handler for a 3D scene.
   * Sets up event listeners for keyboard and mouse interactions.
   *
   * @param {HTMLCanvasElement} canvas - The canvas element for rendering
   * @param {THREE.Camera} camera - The scene's camera
   * @param {THREE.Scene} scene - The 3D scene
   */
  constructor(canvas, camera, scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.targetObject = null;
    this.canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));

    this.canvas.addEventListener("click", (event) => this.onClick(event));
    this.canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));
    this.canvas.addEventListener("mousedown", (event) => this.onMouseDown(event));
    this.canvas.addEventListener("mouseup", (event) => this.onMouseUp(event));
    this.canvas.addEventListener("mouseleave", (event) => this.onMouseUp(event));
    this.canvas.addEventListener("wheel", (event) => this.onMouseWheel(event));

    this.shaderMaterial = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader
  });

  
  }

  /**
   * Sets the target object for interaction handling, allowing specific operations
   * such as color change or selection when clicked.
   *
   * @param {THREE.Object3D} object - The object to set as the target for interactions.
   */
  setTargetObject(object) {
    this.targetObject = object;
  }

    /**
   * Fügt eine Callback-Funktion hinzu, die ausgeführt wird,
   * wenn das Zielobjekt korrekt geklickt wird.
   * 
   * @param {Function} callback - Die Callback-Funktion
   */
    setOnCorrectObjectClick(callback) {
      this.onCorrectObjectClick = callback;
    }

    /**
   * Handles the mouse wheel event for zooming in and out.
   *
   * @param {WheelEvent} event - The mouse wheel event
   */
    onMouseWheel(event) {
      const zoomSpeed = 0.1; // Adjust the zoom speed as needed
  
      if (this.camera.isPerspectiveCamera) {
        // For Perspective Camera
        this.camera.fov += event.deltaY * zoomSpeed;
        this.camera.fov = Math.max(20, Math.min(100, this.camera.fov)); // Clamp FOV between 20 and 100
        this.camera.updateProjectionMatrix();
      } else if (this.camera.isOrthographicCamera) {
        // For Orthographic Camera
        this.camera.zoom -= event.deltaY * zoomSpeed;
        this.camera.zoom = Math.max(0.5, Math.min(5, this.camera.zoom)); // Clamp zoom between 0.5 and 5
        this.camera.updateProjectionMatrix();
      }
    }

  /**
   * Handles click events on the canvas. Uses raycasting to determine if the target
   * object was clicked and changes its color if it was.
   *
   * @param {MouseEvent} event - The mouse click event triggered by user interaction.
   */
  onClick(event) {
    if (!this.targetObject) return;

    const raycaster = new THREE.Raycaster();
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.camera);
    /*const rayHelper = new THREE.ArrowHelper(
        raycaster.ray.direction,
        raycaster.ray.origin,
        10, // Ray length
        0xff0000 // Ray color
    );
    this.scene.add(rayHelper);*/

    const intersects = raycaster.intersectObjects([this.targetObject], true);

    console.log(this.targetObject)
    console.log(intersects)

    if (intersects.length > 0) {
      console.log(`Object was clicked!`);
      this.targetObject.material = this.shaderMaterial; // sets the object color on green
    }

    if (this.onCorrectObjectClick) {
      // 3 Sekunden warten, bevor der Callback ausgeführt wird
      setTimeout(() => {
        this.onCorrectObjectClick();
      }, 1000);
    }
  }

  /**
   * Handles mouse down event to initiate camera movement.
   * Tracks initial mouse position when 'c' key is pressed.
   *
   * @param {MouseEvent} event - The mouse down event
   */
  onMouseDown(event) {
    this.isMouseDown = true; 
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }
  
  onMouseMove(event) {
    // Überprüfe nur, ob Dragging aktiv ist
    if (this.isDragging) {
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y
      };
  
      this.camera.rotation.y -= deltaMove.x * 0.01;
      this.camera.rotation.x -= deltaMove.y * 0.01;
  
      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    }
  }
  
  onMouseUp(event) {
    if (event.button === 0) { // Überprüfe die linke Maustaste
      this.isDragging = false;
    }
  }
  

}