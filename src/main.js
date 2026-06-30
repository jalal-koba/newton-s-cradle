import * as THREE from 'three';
import { createScene } from './scene/createScene.js';
import { createCamera } from './scene/createCamera.js';
import { createRenderer, handleResize } from './scene/createRenderer.js';
import { createLights, createFloor } from './scene/createLights.js';
import { NewtonPhysics } from './physics/cradlePhysics.js';
import { NewtonCradle } from './objects/createNewtonCradle.js';
import { setupControls } from './controls/setupControls.js';
import { DragSystem } from './controls/dragSystem.js';
import { setupUI, updateUI, resetStats } from './ui/setupUI.js';
import { createAnimationLoop } from './animation/animate.js';
import { setupAudioListeners } from './ui/audio.js';
import { setPlayClickCallback } from './physics/collision.js';
import { playClick } from './ui/audio.js';

setPlayClickCallback(playClick);

const container = document.getElementById('canvas-container');
const scene = createScene();

const camera = createCamera();
const renderer = createRenderer(container);

const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
scene.environment = pmremGenerator.fromScene(new THREE.Scene()).texture;

createLights(scene);
createFloor(scene);

const physics = new NewtonPhysics();

const newtonCradle = new NewtonCradle(scene, physics);
newtonCradle.rebuild();

const orbit = setupControls(camera, renderer);

const dragSystem = new DragSystem(camera, renderer, newtonCradle, physics, orbit);

setupUI(physics, newtonCradle);

resetStats();

setupAudioListeners();

window.addEventListener('resize', () => {
    handleResize(camera, renderer);
});

const { animate } = createAnimationLoop(renderer, scene, camera, physics, newtonCradle, orbit, updateUI);
animate();