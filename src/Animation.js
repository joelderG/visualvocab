export default class Animation {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;
    }

    /**
     * Starts the rendering loop for the scene.
     * Continuously calls the renderer to display the scene from the camera's perspective.
    */
    start() {
        const animate = () => {
            requestAnimationFrame(animate);
            this.renderer.render(this.scene, this.camera);
        };
        animate();
    }
}