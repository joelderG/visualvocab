import * as THREE from "three";

export default class InteractionHandler {
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.targetObject = null;

    this.canvas.addEventListener("click", (event) => this.onClick(event));
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
    const mouse = new THREE.Vector2(
      (event.clientX / this.canvas.clientWidth) * 2 - 1,
      -(event.clientY / this.canvas.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(mouse, this.camera);

    const intersects = raycaster.intersectObject(this.targetObject, true);
    if (intersects.length > 0) {
      console.log("Objekt wurde angeklickt!");
      this.targetObject.material.color.set(0x00ff00); // sets the object color on green
    }
  }
}
