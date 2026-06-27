import * as THREE from 'three';
import { BALL_RADIUS, FRAME_SPHERE_RADIUS_SEGMENTS, FRAME_SPHERE_WIDTH_SEGMENTS } from '../core/constants.js';

export function createBallMaterial() {
    return new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 1.0,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        envMapIntensity: 1.2,
    });
}

export function createHighlightMaterial() {
    return new THREE.MeshPhysicalMaterial({
        color: 0x4af0ff,
        metalness: 0.8,
        roughness: 0.1,
        clearcoat: 1.0,
        emissive: 0x1a5060,
        emissiveIntensity: 0.4,
    });
}

export function updateBallMaterial(material, newMass) {
    const t = (newMass - 0.1) / (5 - 0.1);
    const lightness = 1.0 - t * 0.45;
    material.color.setScalar(lightness);
    material.needsUpdate = true;
}

export function createBallMesh(material, geometry) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.castShadow = sphere.receiveShadow = true;
    return sphere;
}

export function createBallGeometry() {
    return new THREE.SphereGeometry(
        BALL_RADIUS,
        FRAME_SPHERE_WIDTH_SEGMENTS,
        FRAME_SPHERE_RADIUS_SEGMENTS
    );
}