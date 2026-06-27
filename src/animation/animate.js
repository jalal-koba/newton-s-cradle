import * as THREE from 'three';
import { updateSimulation } from './updateSimulation.js';

export function createAnimationLoop(renderer, scene, camera, physics, newtonCradle, orbit, updateUIFunc) {
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        const dt = clock.getDelta();
        if (dt <= 0) return;
        
        physics.step(dt);
        updateSimulation(newtonCradle);
        updateUIFunc();
        orbit.update();
        renderer.render(scene, camera);
    }

    return { animate, clock };
}