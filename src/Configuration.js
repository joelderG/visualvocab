export default class Configuration {
    constructor() {
        this.language = null;
        this.selectedScene = null;
        this.path = null;
        this.cameraSettings = {
            scene1: {  // Living Room
                position: { x: 5, y: 5, z: 6 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                near: 0.1,
                far: 1000,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            scene2: {  // Bedroom
                position: { x: -3, y: 5, z: 5 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                near: 0.1,
                far: 1000,
                lookAt: { x: 0, y: 0, z: 0 }
            },
            scene3: {  // Shapes
                position: { x: 0, y: 0, z: 10 },
                rotation: { x: 0, y: 0, z: 0 },
                fov: 75,
                near: 0.1,
                far: 1000,
                lookAt: { x: 0, y: 0, z: 0 }
            }
        };
    }

    setPath(selectedScene) {
        this.selectedScene = selectedScene;
        switch (selectedScene) {
            case "scene1":
                this.path = `../assets/living-room/living-room.glb`;
                console.log("Loading living room scene");
                break;
            case "scene2":
                this.path = `../assets/test/witchs-house.glb`;
                console.log("Loading bedroom scene");
                break;
            case "scene3":
                this.path = `../assets/blender/blender_test_04.gltf`;
                console.log("Loading shapes scene");
                break;
            default:
                console.error("Unknown scene selected:", selectedScene);
                // Fallback to first scene
                this.path = `../assets/living-room/living-room.glb`;
        }
        
        // Validate that the path is set
        if (!this.path) {
            console.error("No path set for scene:", selectedScene);
            return false;
        }
        
        console.log(`Path set for ${selectedScene}: ${this.path}`);
        return true;
    }

    getCameraSettings() {
        return this.cameraSettings[this.selectedScene] || this.cameraSettings.scene1;
    }
}