import * as THREE from 'three';
import { ANCHOR_Y } from '../core/constants.js';

const _anchorTop = new THREE.Vector3();
const _ballPos = new THREE.Vector3();
const _mid = new THREE.Vector3();
const _wireDir = new THREE.Vector3();
const _wireUp = new THREE.Vector3(0, 1, 0);
const _wireQ = new THREE.Quaternion();

export function updateSimulation(newtonCradle) {
    for (const p of newtonCradle.physics.pendulums) {
        p.mesh.position.set(p.pos.x, p.pos.y, 0);

        _ballPos.set(p.pos.x, p.pos.y, 0);
        for (const wo of p.wireObjs) {
            _anchorTop.set(p.pivot.x, ANCHOR_Y, wo.anchorZ);
            const wireLen = _anchorTop.distanceTo(_ballPos);

            _mid.addVectors(_anchorTop, _ballPos).multiplyScalar(0.5);
            wo.mesh.position.copy(_mid);

            _wireDir.subVectors(_ballPos, _anchorTop).normalize();
            _wireQ.setFromUnitVectors(_wireUp, _wireDir);
            wo.mesh.quaternion.copy(_wireQ);

            wo.mesh.scale.set(1, wireLen, 1);
        }
    }
}