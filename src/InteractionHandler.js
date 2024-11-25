import * as THREE from "three";

export default class InteractionHandler {
  constructor(canvas, camera, scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.targetObject = null;
    this.hoveredObject = null; // To keep track of the current hovered object

    this.canvas.addEventListener("click", (event) => this.onClick(event));
    this.canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));
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
    const rayHelper = new THREE.ArrowHelper(
      raycaster.ray.direction,
      raycaster.ray.origin,
      10, // Länge des Strahls
      0xff0000 // Farbe des Pfeils
    );
    this.scene.add(rayHelper);

    const intersects = raycaster.intersectObjects([this.targetObject], true);
  
    console.log(this.targetObject)
    console.log(intersects)

    if (intersects.length > 0) {
      console.log("Objekt wurde angeklickt!");
      this.targetObject.material.color.set(0x00ff00); // sets the object color on green
    }
  }

  onMouseMove(event) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(
        (event.clientX / this.canvas.clientWidth) * 2 - 1,
        -(event.clientY / this.canvas.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObject(this.targetObject, true);
    if (intersects.length > 0) {
      if (this.hoveredObject !== intersects[0].object) {
        if (this.hoveredObject) {
          // Restore the previous hovered object's original color
          this.hoveredObject.material.emissive.setHex(this.hoveredObject.currentHex);
        }
        this.hoveredObject = intersects[0].object;
        this.hoveredObject.currentHex = this.hoveredObject.material.emissive.getHex();
        this.hoveredObject.material.emissive.setHex(0xff0000); // Highlight color
      }
    } else if (this.hoveredObject) {
      // Restore the original color when the mouse moves away
      this.hoveredObject.material.emissive.setHex(this.hoveredObject.currentHex);
      this.hoveredObject = null;
    }
  }
}
