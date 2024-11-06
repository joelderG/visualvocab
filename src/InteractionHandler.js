import * as THREE from "three";

export default class InteractionHandler {
    constructor(canvas, camera) {
        this.canvas = canvas;
        this.camera = camera;
        this.targetObject = null;

        this.canvas.addEventListener("click", (event) => this.onClick(event));
    }

    setTargetObject(object) {
        this.targetObject = object;
    }

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