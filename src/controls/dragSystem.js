import * as THREE from 'three';
import { N_BALLS } from '../core/config.js';

export class DragSystem {
    constructor(camera, renderer, newtonCradle, physics, orbit) {
        this.camera = camera;
        this.renderer = renderer;
        this.newtonCradle = newtonCradle;
        this.physics = physics;
        this.orbit = orbit;

        this.raycaster = new THREE.Raycaster();
        this.mouse2D = new THREE.Vector2();
        this.dragPlane = new THREE.Plane();
        this.planeNorm = new THREE.Vector3();
        this.dragPoint = new THREE.Vector3();

        this.dragged = new Set();
        this.dragAngles = new Map();
        this.isDragging = false;
        this.dragInfo = document.getElementById('drag-info');

        this.setupEventListeners();
    }

    setDragPlane() {
        this.camera.getWorldDirection(this.planeNorm);
        this.dragPlane.setFromNormalAndCoplanarPoint(this.planeNorm, new THREE.Vector3(0, 0, 0));
    }

    getBallUnderMouse(e) {
        this.mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse2D, this.camera);
        const hits = this.raycaster.intersectObjects(this.newtonCradle.getBallMeshes());
        if (hits.length > 0) return hits[0].object.userData.pendulumIndex;
        return -1;
    }

    getMouseWorld(e) {
        this.mouse2D.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse2D.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse2D, this.camera);
        this.raycaster.ray.intersectPlane(this.dragPlane, this.dragPoint);
        return this.dragPoint.clone();
    }

    setupEventListeners() {
        this.renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        this.renderer.domElement.addEventListener('pointermove', this.onPointerMove.bind(this));
        window.addEventListener('pointerup', this.onPointerUp.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    onPointerDown(e) {
        const idx = this.getBallUnderMouse(e);
        if (idx < 0) return;

        this.orbit.enabled = false;
        this.setDragPlane();

        const wp = this.getMouseWorld(e);
        if (!wp) return;

        this.dragged.clear();
        this.dragged.add(idx);

        this.dragged.forEach(i => {
            this.physics.pendulums[i].isDragged = true;
            this.newtonCradle.setBallHighlight(i, true);
            this.dragAngles.set(i, 0);
        });

        this.isDragging = true;
        this.dragInfo.style.opacity = '1';
        this.dragInfo.textContent = `${this.dragged.size} كرة محددة`;
        document.getElementById('hint').style.opacity = '0.3';
    }

    onPointerMove(e) {
        if (!this.isDragging) return;

        const wp = this.getMouseWorld(e);
        if (!wp) return;

        const firstPivotX = this.physics.pendulums[[...this.dragged][0]].pivot.x;

        this.dragged.forEach(idx => {
            const p = this.physics.pendulums[idx];
            p.pos.x = wp.x + (p.pivot.x - firstPivotX);
            p.pos.y = wp.y;
            p.pos.z = 0;
            p.applyConstraint();
            p.vel.x = p.vel.y = p.vel.z = 0;
        });
    }

    onPointerUp() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.orbit.enabled = true;

        this.dragged.forEach(idx => {
            this.physics.pendulums[idx].isDragged = false;
            this.newtonCradle.setBallHighlight(idx, false);
        });

        this.dragged.clear();
        this.dragAngles.clear();
        this.dragInfo.style.opacity = '0';
        document.getElementById('hint').style.opacity = '1';
    }

    onKeyDown(e) {
        const n = parseInt(e.key);
        if (n >= 1 && n <= N_BALLS.value) {
            this.physics.reset();
            const angle = Math.PI / 4;
            for (let i = 0; i < n; i++) {
                const p = this.physics.pendulums[i];
                p.pos.x = p.pivot.x - Math.sin(angle) * p.L;
                p.pos.y = p.pivot.y - Math.cos(angle) * p.L;
                p.applyConstraint();
            }
        }
        if (e.key === 'r' || e.key === 'R') this.physics.reset();
    }
}