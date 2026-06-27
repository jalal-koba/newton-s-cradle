import { Vec3 } from './Vec3.js';

export class Pendulum {
    constructor(mass, radius, L, pivotX, pivotY) {
        this.mass = mass;
        this.radius = radius;
        this.L = L;
        this.pivot = new Vec3(pivotX, pivotY, 0);
        this.pos = new Vec3(pivotX, pivotY - L, 0);
        this.vel = new Vec3();
        this.prevPos = this.pos.clone();
        this.isDragged = false;
        this.mesh = null;
        this.wireObjs = null;
        this.lineMesh = null;
    }

    applyConstraint() {
        const d = this.pos.sub(this.pivot);
        const m = d.mag;
        if (m < 1e-10) return;
        this.pos = this.pivot.add(d.scale(this.L / m));
    }
}