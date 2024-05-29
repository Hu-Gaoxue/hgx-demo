import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as THREE from 'three';


// Instantiate a loader
function setupModel(data) {
    const model = data.scene.children[0];
    const clip=data.animations[0];
    const mixer=new THREE.AnimationMixer(model);
    const action=mixer.clipAction(clip);
    action.play();
    model.tick=(delta)=>mixer.update(delta);
    return model;
  }

const loader = new GLTFLoader();
const [parrotData, FlamingoData, StorkData] =await Promise.all([
    loader.loadAsync('./src/assets/Parrot.glb'),
    loader.loadAsync('./src/assets/Flamingo.glb'),
    loader.loadAsync('./src/assets/Stork.glb'),
  ])


const parrot=setupModel(parrotData);
parrot.position.set(100, 30, 0);

const Flamingo=setupModel(FlamingoData);

const stork=setupModel(StorkData);
stork.position.set(-150, 20, -30);

export default [parrot,Flamingo,stork];