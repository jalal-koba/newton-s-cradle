import * as THREE from 'three';
import { Pendulum } from '../physics/Pendulum.js';
import { createBallMaterial, createBallGeometry, createBallMesh, createHighlightMaterial, updateBallMaterial } from './createBall.js';
import { createWireMaterial, createWireGeometry, createWirePair, createFrameMaterial } from './createString.js';
import { BALL_RADIUS, BALL_DIAMETER, STRING_LENGTH, ANCHOR_Y, FRAME_PILLAR_OFFSET, FRAME_TOP_BAR_PADDING } from '../core/constants.js';
import { N_BALLS, BALL_MASS } from '../core/config.js';

export class NewtonCradle {
    constructor(scene, physics) {
        this.scene = scene;
        this.physics = physics;
        this.ballMeshes = [];
        this.frameGroup = null;
        this.sphereGeo = createBallGeometry();
        this.ballMat = createBallMaterial();
        this.highlightMat = createHighlightMaterial();
        this.wireMat = createWireMaterial();
        this.wireGeo = createWireGeometry();
        this.frameMat = createFrameMaterial();
        this.highlightedMaterials = [];
    }

    rebuild() {
        for (const p of this.physics.pendulums) {
            if (p.mesh) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
            }
            if (p.wireObjs) {
                for (const wo of p.wireObjs) {
                    this.scene.remove(wo.mesh);
                    wo.mesh.geometry.dispose();
                }
            }
        }
        this.physics.pendulums = [];
        this.ballMeshes = [];

        for (const mat of this.highlightedMaterials) {
            mat.dispose();
        }
        this.highlightedMaterials = [];

        if (this.frameGroup) {
            this.scene.remove(this.frameGroup);
            this.frameGroup = null;
        }

        const totalWidth = (N_BALLS.value - 1) * BALL_DIAMETER;
        const frameHalfW = totalWidth / 2 + FRAME_PILLAR_OFFSET;
        const frameWidth = frameHalfW * 2 + FRAME_TOP_BAR_PADDING;
        const startX = -totalWidth / 2;

        this.frameGroup = new THREE.Group();
        this.scene.add(this.frameGroup);

        const base = new THREE.Mesh(
            new THREE.BoxGeometry(frameWidth, 0.35, 4),
            this.frameMat
        );
        base.position.set(0, -1.45, 0);
        base.castShadow = base.receiveShadow = true;
        this.frameGroup.add(base);

        const pillarH = STRING_LENGTH + 2.2;
        const pillarGeo = new THREE.CylinderGeometry(0.12, 0.12, pillarH, 24);
        const pillarY = STRING_LENGTH / 2 - 0.5;
        for (const [sx, sz] of [[-frameHalfW, -1.3], [-frameHalfW, 1.3], [frameHalfW, -1.3], [frameHalfW, 1.3]]) {
            const pm = new THREE.Mesh(pillarGeo, this.frameMat);
            pm.position.set(sx, pillarY, sz);
            pm.castShadow = true;
            this.frameGroup.add(pm);
        }

        const barGeo = new THREE.CylinderGeometry(0.1, 0.1, frameWidth, 24);
        barGeo.rotateZ(Math.PI / 2);
        for (const sz of [-1.3, 1.3]) {
            const bm = new THREE.Mesh(barGeo, this.frameMat);
            bm.position.set(0, STRING_LENGTH, sz);
            bm.castShadow = true;
            this.frameGroup.add(bm);
        }

        for (let i = 0; i < N_BALLS.value; i++) {
            const px = startX + i * BALL_DIAMETER;
            const pend = new Pendulum(BALL_MASS.value, BALL_RADIUS, STRING_LENGTH, px, STRING_LENGTH);

            const sphere = createBallMesh(this.ballMat, this.sphereGeo);
            sphere.userData.pendulumIndex = i;
            this.scene.add(sphere);
            pend.mesh = sphere;
            this.ballMeshes.push(sphere);

            pend.wireObjs = createWirePair(this.wireMat, this.wireGeo, this.scene);
            pend.lineMesh = null;

            this.physics.pendulums.push(pend);
        }
    }

    updateMasses(newMass) {
        for (const p of this.physics.pendulums) {
            p.mass = newMass;
        }
        updateBallMaterial(this.ballMat, newMass);
    }

    setBallHighlight(pendulumIndex, highlight) {
        const p = this.physics.pendulums[pendulumIndex];
        if (!p || !p.mesh) return;

        if (highlight) {
            const mat = this.highlightMat.clone();
            p.mesh.material = mat;
            this.highlightedMaterials.push(mat);
        } else {
            p.mesh.material = this.ballMat.clone();
        }
    }

    getBallMeshes() {
        return this.ballMeshes;
    }

    dispose() {
        this.sphereGeo.dispose();
        this.ballMat.dispose();
        this.highlightMat.dispose();
        this.wireMat.dispose();
        this.wireGeo.dispose();
        this.frameMat.dispose();

        for (const mat of this.highlightedMaterials) {
            mat.dispose();
        }
    }
}