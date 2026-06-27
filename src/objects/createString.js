import * as THREE from 'three';
import { FRAME_WIRE_RADIUS, FRAME_WIRE_RADIUS_SEGMENTS, ANCHOR_Z_SPREAD } from '../core/constants.js';

export function createWireMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0x8899bb,
        metalness: 0.9,
        roughness: 0.3
    });
}

export function createWireGeometry() {
    return new THREE.CylinderGeometry(
        FRAME_WIRE_RADIUS,
        FRAME_WIRE_RADIUS,
        1,
        FRAME_WIRE_RADIUS_SEGMENTS
    );
}

export function createWirePair(material, geometry, scene) {
    const wireObjs = [];
    for (const zo of [-ANCHOR_Z_SPREAD, ANCHOR_Z_SPREAD]) {
        const wireM = new THREE.Mesh(geometry, material);
        wireM.castShadow = true;
        scene.add(wireM);
        wireObjs.push({ mesh: wireM, anchorZ: zo });
    }
    return wireObjs;
}

export function createFrameMaterial() {
    return new THREE.MeshStandardMaterial({
        color: 0x0d1622,
        metalness: 0.6,
        roughness: 0.5
    });
}

export function createPillarGeometry() {
    return new THREE.CylinderGeometry(0.12, 0.12, 1, 24);
}

export function createTopBarGeometry() {
    return new THREE.CylinderGeometry(0.1, 0.1, 1, 24);
}