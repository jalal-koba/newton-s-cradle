import { Vec3 } from './Vec3.js';
import { ANCHOR_Z_SPREAD } from '../core/constants.js';

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

        // V-shape double wires configuration
        this.L_wire = Math.sqrt(L * L + ANCHOR_Z_SPREAD * ANCHOR_Z_SPREAD);
        this.anchor1 = new Vec3(pivotX, pivotY, -ANCHOR_Z_SPREAD);
        this.anchor2 = new Vec3(pivotX, pivotY, ANCHOR_Z_SPREAD);
        this.isSlack = false;
    }

    applyConstraint() {
        // Iteratively resolve both wire length constraints (inequality: distance <= L_wire)
        for (let iter = 0; iter < 3; iter++) {
            // Constraint for wire 1
            const d1 = this.pos.sub(this.anchor1);
            const m1 = d1.mag;
            if (m1 > this.L_wire && m1 > 1e-10) {
                this.pos = this.anchor1.add(d1.scale(this.L_wire / m1));
            }

            // Constraint for wire 2
            const d2 = this.pos.sub(this.anchor2);
            const m2 = d2.mag;
            if (m2 > this.L_wire && m2 > 1e-10) {
                this.pos = this.anchor2.add(d2.scale(this.L_wire / m2));
            }
        }

        // Check if both strings are slack (less than L_wire with a tiny buffer)
        const dist1 = this.pos.sub(this.anchor1).mag;
        const dist2 = this.pos.sub(this.anchor2).mag;
        this.isSlack = (dist1 < this.L_wire - 0.001) && (dist2 < this.L_wire - 0.001);
    }
}