export default class Configuration {
    constructor(){
        this.language = null; 
        this.selectedScene = null; 
        this.path = null;
    }

    setPath(selectedScene) {
        switch (selectedScene) {
            case "scene1": 
                this.path = `../assets/living-room/living-room.glb`;
                console.log("scene 1 Path: " + this.path);
                break;
            case "scene2":
                this.path = `../assets/bedroom/bedroom.glb`;
                console.log("scene 2 Path: " + this.path);
                break;
            case "scene3":
                this.path = `../assets/blender/blender_test_04.gltf`;
                console.log("scene 3 Path: " + this.path);
                break;
        }
    }
    
}