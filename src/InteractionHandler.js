import * as THREE from "three";
import vertexShader from "./shaders/vertex.glsl.js";
import fragmentShader from "./shaders/fragment.glsl.js";
import skipVertexShader from "./shaders/skip_vertex.glsl.js";
import skipFragmentShader from "./shaders/skip_fragment.glsl.js";
import hintVertexShader from "./shaders/hint_vertex.glsl.js";
import hintFragmentShader from "./shaders/hint_fragment.glsl.js";

export default class InteractionHandler {
  constructor(canvas, camera, scene, translationManager) {
    this.canvas = canvas;
    this.camera = camera;
    this.scene = scene;
    this.translationManager = translationManager;
    this.currentBaseId = null;
    this.time = 0;
    this.activeShaderObjects = new Set();
    this.shaderStartTime = null;
    this.wrongCount  = 0; 
    this.skipCount = 0; 
    this.hintCount = 0; 

    // Shader für korrekte Auswahl (grün pulsierend)
    this.correctShader = new THREE.ShaderMaterial({
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
        uColor: { value: new THREE.Vector3(0.0, 1.0, 0.0) },
      },
    });

    // Shader für übersprungene Objekte (rot pulsierend)
    this.skipShader = new THREE.ShaderMaterial({
      vertexShader: skipVertexShader,
      fragmentShader: skipFragmentShader,
      uniforms: {
        uTime: { value: 0.0 },
      },
    });

      // Shader für übersprungene Objekte (gelb pulsierend)
      this.hintShader = new THREE.ShaderMaterial({
        vertexShader: hintVertexShader,
        fragmentShader: hintFragmentShader,
        uniforms: {
          uTime: { value: 0.0 },
        },
      });


    this.setupEventListeners();
    this.startAnimation();
  }

  setupEventListeners() {
    this.canvas.addEventListener("mousemove", (event) =>
      this.onMouseMove(event)
    );
    this.canvas.addEventListener("click", (event) => this.onClick(event));
    this.canvas.addEventListener("mousedown", (event) =>
      this.onMouseDown(event)
    );
    this.canvas.addEventListener("mouseup", (event) => this.onMouseUp(event));
    this.canvas.addEventListener("mouseleave", (event) =>
      this.onMouseUp(event)
    );
    this.canvas.addEventListener("wheel", (event) => this.onMouseWheel(event));
    document
      .querySelector("#gameScreen")
      .addEventListener("click", (event) => this.handleBtnClick(event));
  }

  startAnimation() {
    const animate = () => {
      requestAnimationFrame(animate);

      const currentTime = Date.now() / 1000;

      // Update shader uniforms
      if (this.correctShader.uniforms.uTime) {
        this.correctShader.uniforms.uTime.value = currentTime;
      }
      if (this.skipShader.uniforms.uTime) {
        this.skipShader.uniforms.uTime.value = currentTime;
      }

      // Prüfe Timer für Shader-Entfernung
      if (this.shaderStartTime && currentTime - this.shaderStartTime > 1) {
        this.resetShaders();
        this.shaderStartTime = null;
      }
    };
    animate();
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

      if (
        this.translationManager.isObjectInGroup(
          clickedObject.name,
          this.currentBaseId
        )
      ) {
        console.log("✅ Correct object clicked:", clickedObject.name);
        this.applyShaderToGroup(this.currentBaseId, this.correctShader);

        if (this.onCorrectObjectClick) {
          setTimeout(() => {
            this.onCorrectObjectClick();
          }, 1000);
        }
      } else {
        console.log("❌ Wrong object clicked:", clickedObject.name);
        this.wrongCount++; 
        console.log(this.wrongCount);
        if(this.wrongCount > 5) {
          this.applyShaderToGroup(this.currentBaseId, this.skipShader);
        }
        if (this.onWrongObjectClick) {
          setTimeout(() => {
            this.onWrongObjectClick();
          }, 1000);
        }
      }
    }
  }

  handleBtnClick(event) {
    if (event.target.tagName === "BUTTON") {
      if (event.target.id === "hint-btn") {
        console.log("Hint requested for base ID:", this.currentBaseId);
        if(this.hintCount < 4) {
          this.applyShaderToGroup(this.currentBaseId, this.hintShader);
          this.hintCount++; 
        } else {
          document.getElementById("tooltiptext").innerHTML = "No more hints!"
          document.getElementById("hint-btn").disabled = "disabled" 
        }
      } else if (event.target.id === "skip-btn") {
        console.log("Skipping base ID:", this.currentBaseId);
        this.applyShaderToGroup(this.currentBaseId, this.skipShader);
        this.skipCount++; 
        console.log("skips: ", this.skipCount)

        if (this.onSkipClick) {
          setTimeout(() => {
            this.onSkipClick();
          }, 3000);
        }
      }
    }
  }

  onMouseDown(event) {
    this.isMouseDown = true;
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY,
    };
  }

  onMouseMove(event) {
    if (this.isDragging) {
      const deltaMove = {
        x: event.clientX - this.previousMousePosition.x,
        y: event.clientY - this.previousMousePosition.y,
      };

      this.camera.rotation.y -= deltaMove.x * 0.01;
      this.camera.rotation.x -= deltaMove.y * 0.01;

      this.previousMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  onMouseUp(event) {
    if (event.button === 0) {
      this.isDragging = false;
    }
  }

  setTargetBaseId(baseId) {
    console.log("Setting target base ID:", baseId);
    this.currentBaseId = baseId;
  }

  findObjectsByBaseId(baseId) {
    const objects = [];
    this.scene.traverse((node) => {
      if (
        node.isMesh &&
        this.translationManager.isObjectInGroup(node.name, baseId)
      ) {
        objects.push(node);
      }
    });
    return objects;
  }

  setTargetObject(object) {
    console.log("Setting target object:", object.name);
    this.targetObject = object;
  }

  setOnCorrectObjectClick(callback) {
    this.onCorrectObjectClick = callback;
  }

  setOnWrongObjectClick(callback) {
    this.onWrongObjectClick = callback;
  }

  setOnSkipClick(callback) {
    this.onSkipClick = callback;
  }

  normalizeObjectName(name) {
    // Entfernt Zahlen und Unterstriche am Ende
    // "TV_1", "TV_2", "TV" werden alle zu "TV"
    return name.split("_")[0];
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

  applyShaderToGroup(baseId, shader) {
    this.resetShaders();
    const objects = this.findObjectsByBaseId(baseId);

    objects.forEach((obj) => {
      obj.originalMaterial = obj.material;
      obj.material = shader.clone();
      this.activeShaderObjects.add(obj);
    });

    this.shaderStartTime = Date.now() / 1000;
  }

  resetShaders() {
    this.activeShaderObjects.forEach((obj) => {
      if (obj.originalMaterial) {
        obj.material = obj.originalMaterial;
      }
    });
    this.activeShaderObjects.clear();
  }
}
