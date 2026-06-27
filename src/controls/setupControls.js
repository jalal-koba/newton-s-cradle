import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ORBIT_TARGET_X, ORBIT_TARGET_Y, ORBIT_TARGET_Z, ORBIT_DAMPING_FACTOR, ORBIT_MAX_POLAR_ANGLE } from '../core/config.js';

export function setupControls(camera, renderer) {
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = ORBIT_DAMPING_FACTOR;
    orbit.target.set(ORBIT_TARGET_X, ORBIT_TARGET_Y, ORBIT_TARGET_Z);
    orbit.maxPolarAngle = ORBIT_MAX_POLAR_ANGLE;
    
    return orbit;
}