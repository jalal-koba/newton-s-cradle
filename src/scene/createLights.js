import * as THREE from 'three';
import { SHADOW_MAP_SIZE, SHADOW_CAMERA_NEAR, SHADOW_CAMERA_FAR, SHADOW_BIAS } from '../core/config.js';

export function createLights(scene) {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    const sun = new THREE.DirectionalLight(0xffffff, 2.5);
    sun.position.set(6, 12, 8);
    sun.castShadow = true;
    sun.shadow.mapSize.width = sun.shadow.mapSize.height = SHADOW_MAP_SIZE;
    sun.shadow.camera.near = SHADOW_CAMERA_NEAR;
    sun.shadow.camera.far = SHADOW_CAMERA_FAR;
    sun.shadow.bias = SHADOW_BIAS;
    scene.add(sun);

    const fill = new THREE.DirectionalLight(0xb8d8ff, 1.2);
    fill.position.set(-6, 4, -6);
    scene.add(fill);

    const rim = new THREE.PointLight(0x4af0ff, 4, 22);
    rim.position.set(0, 6, -6);
    scene.add(rim);

    return { ambient, sun, fill, rim };
}

export function createFloor(scene) {
    const floorMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(80, 80),
        new THREE.MeshStandardMaterial({ color: 0x1a233a, roughness: 0.6, metalness: 0.2 })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = -1.6;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const grid = new THREE.GridHelper(80, 80, 0x4af0ff, 0x0e1826);
    grid.position.y = -1.59;
    grid.material.opacity = 0.12;
    grid.material.transparent = true;
    scene.add(grid);

    return { floorMesh, grid };
}