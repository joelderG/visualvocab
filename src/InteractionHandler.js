import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl.js"
import fragmentShader from "./shaders/fragment.glsl.js";
import skipVertexShader from "./shaders/skip_vertex.glsl.js"
import skipFragmentShader from "./shaders/skip_fragment.glsl.js";

export default class InteractionHandler {
  constructor(canvas, camera, scene) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.targetObject = null;
    this.time = 0;

    // Standard Shader Material
    this.shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0.0 }
        }
    });

    // Skip Shader Material
    this.skipShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: skipVertexShader,
        fragmentShader: skipFragmentShader,
        uniforms: {
            uTime: { value: 0.0 },
            cameraPosition: { value: this.camera.position }
        }
    });

    // Event Listeners
    this.setupEventListeners();
    this.startAnimation();
}

setupEventListeners() {
  this.canvas.addEventListener("mousemove", (event) => this.onMouseMove(event));
  this.canvas.addEventListener("click", (event) => this.onClick(event));
  this.canvas.addEventListener("mousedown", (event) => this.onMouseDown(event));
  this.canvas.addEventListener("mouseup", (event) => this.onMouseUp(event));
  this.canvas.addEventListener("mouseleave", (event) => this.onMouseUp(event));
  this.canvas.addEventListener("wheel", (event) => this.onMouseWheel(event));
  document.querySelector('#gameScreen').addEventListener('click', (event) => this.handleBtnClick(event));
}

startAnimation() {
  const animate = () => {
      requestAnimationFrame(animate);
      this.time += 0.016;
      if (this.shaderMaterial.uniforms) {
          this.shaderMaterial.uniforms.uTime.value = this.time;
      }
      if (this.skipShaderMaterial.uniforms) {
          this.skipShaderMaterial.uniforms.uTime.value = this.time;
          this.skipShaderMaterial.uniforms.cameraPosition.value = this.camera.position;
      }
  };
  animate();
}

  setTargetObject(object) {
    this.targetObject = object;
  }

  setOnCorrectObjectClick(callback) {
    console.log("callback from onCorrectObj: ", callback)
    this.onCorrectObjectClick = callback;
  }

  setOnWrongObjectClick(callback) {
    this.onWrongObjectClick = callback;
    console.log("callback from onWrongObj: ", callback)
  }

  setOnSkipClick(callback) {
    this.onSkipClick = callback;
    console.log("callback from onSkipObj: ", callback)
  }

  onMouseWheel(event) {
    const zoomSpeed = 0.1;

    if (this.camera.isPerspectiveCamera) {
      this.camera.fov += event.deltaY * zoomSpeed;
      this.camera.fov = Math.max(20, Math.min(100, this.camera.fov));
      this.camera.updateProjectionMatrix();
    } else if (this.camera.isOrthographicCamera) {
      this.camera.zoom -= event.deltaY * zoomSpeed;
      this.camera.zoom = Math.max(0.5, Math.min(5, this.camera.zoom));
      this.camera.updateProjectionMatrix();
    }
  }

  onClick(event) {
    if (!this.targetObject) return;

    const raycaster = new THREE.Raycaster();
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects([this.targetObject], true);

    if (intersects.length > 0) {
      console.log(`Object was clicked!`);
      // Shader Material zum geklickten Objekt hinzufügen
      this.targetObject.material = this.shaderMaterial;
      // Reset time für frischen Start der Animation
      this.time = 0;
      
      if (this.onCorrectObjectClick) {
        setTimeout(() => {
          this.onCorrectObjectClick();
        }, 1000);
      }
    } else {
      console.log('wrong object')
    this.targetObject.material = this.shaderMaterial;

    if(this.onWrongObjectClick) {
      setTimeout(() => {
        this.onWrongObjectClick();
      }, 1000);
    }

  }
}

handleBtnClick(event) {
  if (event.target.tagName === 'BUTTON') {
      if(event.target.id === 'hint-btn') {
          console.log("This is a hint!");
          this.targetObject.material = this.shaderMaterial;
      } else if(event.target.id === 'skip-btn') {
          console.log("Skip this one");
          if (!this.targetObject) return;
          // Verwende den Skip-Shader
          this.targetObject.material = this.skipShaderMaterial;

          if (this.onSkipClick) {
              setTimeout(() => {
                  this.onSkipClick();
              }, 1000);
          }
      }
  }
}


  onMouseDown(event) {
    this.isMouseDown = true;
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  }

  onMouseMove(event) {
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
    if (event.button === 0) {
      this.isDragging = false;
    }
  }
}