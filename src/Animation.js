export default class Animation {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;
    this.time = 0;
  }

  /**
   * Starts the rendering loop for the scene.
   * Continuously calls the renderer to display the scene from the camera's perspective.
   */
  start() {
    const animate = () => {
      requestAnimationFrame(animate);
      this.renderer.render(this.scene.scene, this.camera);
      this.time += 0.001; 
      this.scene.shaderMaterial.uniforms.uTime.value = this.time; 
    };
   
    animate();
  }
}
