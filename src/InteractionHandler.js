import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl.js"
import fragmentShader from "./shaders/fragment.glsl.js";
import skipVertexShader from "./shaders/skip_vertex.glsl.js"
import skipFragmentShader from "./shaders/skip_fragment.glsl.js";

export default class InteractionHandler {
  constructor(canvas, camera, scene, translationManager) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.translationManager = translationManager;
    this.currentBaseId = null;  // Aktuelle Basis-ID (z.B. "tv" oder "book")
    this.time = 0;

    // Shader Setup bleibt gleich
    this.shaderMaterial = new THREE.ShaderMaterial({
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
            uTime: { value: 0.0 }
        }
    });

    this.skipShaderMaterial = new THREE.ShaderMaterial({
        vertexShader: skipVertexShader,
        fragmentShader: skipFragmentShader,
        uniforms: {
            uTime: { value: 0.0 }
        }
    });

    this.setupEventListeners();
    this.startAnimation();
}

setTargetBaseId(baseId) {
  console.log("Setting target base ID:", baseId);
  this.currentBaseId = baseId;
}

// Findet alle Objekte einer Basis-ID in der Szene
findObjectsByBaseId(baseId) {
  const objects = [];
  this.scene.traverse((node) => {
      if (node.isMesh && this.translationManager.isObjectInGroup(node.name, baseId)) {
          objects.push(node);
      }
  });
  return objects;
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
      }
  };
  animate();
}

setTargetObject(object) {
  console.log("Setting target object:", object.name);
  this.targetObject = object;
}

  // Callback-Setter bleiben gleich
  setOnCorrectObjectClick(callback) {
    this.onCorrectObjectClick = callback;
}

setOnWrongObjectClick(callback) {
    this.onWrongObjectClick = callback;
}

setOnSkipClick(callback) {
    this.onSkipClick = callback;
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
    if (!this.currentBaseId) {
        console.log("No target base ID set");
        return;
    }

    const raycaster = new THREE.Raycaster();
    const rect = this.canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        console.log("Clicked object:", clickedObject.name);
        console.log("Looking for objects in group:", this.currentBaseId);

        let found = false;
        let currentObject = clickedObject;

        // Traversiere die Hierarchie und prüfe auf Gruppenzugehörigkeit
        while (currentObject && !found) {
            if (this.translationManager.isObjectInGroup(currentObject.name, this.currentBaseId)) {
                found = true;
            } else {
                currentObject = currentObject.parent;
            }
        }

        if (found) {
            console.log("✅ Correct object clicked:", clickedObject.name);
            // Färbe alle Objekte der Gruppe
            this.applyShaderToGroup(this.currentBaseId, this.shaderMaterial);
            this.time = 0;
            
            if (this.onCorrectObjectClick) {
                setTimeout(() => {
                    this.onCorrectObjectClick();
                }, 1000);
            }
        } else {
            console.log("❌ Wrong object clicked:", clickedObject.name);
            if (this.onWrongObjectClick) {
                setTimeout(() => {
                    this.onWrongObjectClick();
                }, 1000);
            }
        }
    }
}

normalizeObjectName(name) {
  // Entfernt Zahlen und Unterstriche am Ende
  // "TV_1", "TV_2", "TV" werden alle zu "TV"
  return name.split('_')[0];
}


handleBtnClick(event) {
  if (event.target.tagName === 'BUTTON') {
      if (event.target.id === 'hint-btn') {
          console.log("Hint requested for base ID:", this.currentBaseId);
          this.applyShaderToGroup(this.currentBaseId, this.shaderMaterial);
      } else if (event.target.id === 'skip-btn') {
          console.log("Skipping base ID:", this.currentBaseId);
          this.applyShaderToGroup(this.currentBaseId, this.skipShaderMaterial);

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

  findRelatedObjects(baseName) {
    const relatedObjects = [];
    this.scene.traverse((node) => {
        if (node.name && this.normalizeObjectName(node.name) === baseName) {
            relatedObjects.push(node);
        }
    });
    return relatedObjects;
}

// Wendet den Shader auf alle Objekte einer Gruppe an
applyShaderToGroup(baseId, shader) {
  const objects = this.findObjectsByBaseId(baseId);
  objects.forEach(obj => {
      obj.material = shader.clone();
  });
}

}