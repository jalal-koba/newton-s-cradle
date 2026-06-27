import * as THREE from 'three';
import { GRAVITY, DEFAULT_RESTITUTION, DEFAULT_DAMPING, DEFAULT_SPEED_MULT, PHYSICS_SUB_STEPS, PHYSICS_OVERLAP_PASSES, PHYSICS_VELOCITY_ITERATIONS, PHYSICS_MAX_DT } from '../core/config.js';
import { integrate } from './pendulumMotion.js';
import { resolveOverlap, resolveVelocity } from './collision.js';

export class NewtonPhysics {
    constructor() {
        this.pendulums = [];
        this.restitution = DEFAULT_RESTITUTION;
        this.damping = DEFAULT_DAMPING;
        this.speedMult = DEFAULT_SPEED_MULT;
        this.gravity = GRAVITY;
        this.collisions = 0;
        this._maxEnergy = 1;
    }

    reset() {
        for (const p of this.pendulums) {
            p.pos.x = p.pivot.x;
            p.pos.y = p.pivot.y - p.L;
            p.pos.z = 0;
            p.prevPos = p.pos.clone();
            p.vel.x = p.vel.y = p.vel.z = 0;
            p.isDragged = false;
        }
        this.collisions = 0;
    }

    step(frameDt) {
        const dt = Math.min(frameDt, PHYSICS_MAX_DT) * this.speedMult;
        const SUB = PHYSICS_SUB_STEPS;
        const subDt = dt / SUB;

        for (let s = 0; s < SUB; s++) {
            for (const p of this.pendulums) integrate(p, subDt, this.damping);

            for (let k = 0; k < PHYSICS_OVERLAP_PASSES; k++) {
                for (let i = 0; i < this.pendulums.length - 1; i++)
                    resolveOverlap(this.pendulums[i], this.pendulums[i + 1], this.restitution);
                for (let i = this.pendulums.length - 2; i >= 0; i--)
                    resolveOverlap(this.pendulums[i], this.pendulums[i + 1], this.restitution);
            }

            let changed = true, iter = 0;
            while (changed && iter < PHYSICS_VELOCITY_ITERATIONS) {
                changed = false;
                for (let i = 0; i < this.pendulums.length - 1; i++)
                    if (resolveVelocity(this.pendulums[i], this.pendulums[i + 1], this.restitution, iter === 0)) changed = true;
                for (let i = this.pendulums.length - 2; i >= 0; i--)
                    if (resolveVelocity(this.pendulums[i], this.pendulums[i + 1], this.restitution, false)) changed = true;
                iter++;
            }
        }
    }

    energy() {
        let ke = 0, pe = 0;
        for (const p of this.pendulums) {
            const v = p.vel.mag;
            ke += 0.5 * p.mass * v * v;
            const h = p.pos.y - (p.pivot.y - p.L);
            pe += p.mass * this.gravity * Math.max(0, h);
        }
        return { ke, pe };
    }
}