import * as THREE from 'three';
import { FOG_DENSITY } from '../core/config.js';

const SCENE_BACKGROUND = '#060810';

export function createScene() {
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(SCENE_BACKGROUND, FOG_DENSITY);
    scene.background = new THREE.Color(SCENE_BACKGROUND);
    return scene;
}