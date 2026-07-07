import { Vec3 } from './Vec3.js';
import { GRAVITY, PHYSICS_SUB_STEPS, PHYSICS_OVERLAP_PASSES, PHYSICS_VELOCITY_ITERATIONS, PHYSICS_MAX_DT } from '../core/config.js';
import { resolveOverlap, resolveVelocity } from './collision.js';

export function integrate(p, dt, damping) {
    if (p.isDragged) {
        p.applyConstraint();
        p.vel.x = p.vel.y = p.vel.z = 0;
        p.prevPos = p.pos.clone();
        return;
    }

    const ax = 0;
    const ay = -GRAVITY;
    const az = 0;

    // Verlet integration of position in 3D
    const newX = p.pos.x + p.vel.x * dt + 0.5 * ax * dt * dt;
    const newY = p.pos.y + p.vel.y * dt + 0.5 * ay * dt * dt;
    const newZ = p.pos.z + p.vel.z * dt + 0.5 * az * dt * dt;

    p.prevPos = p.pos.clone();
    p.pos.x = newX;
    p.pos.y = newY;
    p.pos.z = newZ;

    // Apply the 3D double-wire constraints (with slackness)
    p.applyConstraint();

    // Derive velocity from position difference
    p.vel.x = (p.pos.x - p.prevPos.x) / dt;
    p.vel.y = (p.pos.y - p.prevPos.y) / dt;
    p.vel.z = (p.pos.z - p.prevPos.z) / dt;

    // Tension shock: if a wire becomes taut (distance to anchor close to L_wire),
    // we eliminate the velocity component directed away from the anchor.
    for (const anchor of [p.anchor1, p.anchor2]) {
        const d = p.pos.sub(anchor);
        const m = d.mag;
        if (m > p.L_wire - 0.002) {
            const dir = d.norm;
            const vr = dir.dot(p.vel);
            if (vr > 0) { // moving away from anchor
                p.vel.x -= vr * dir.x;
                p.vel.y -= vr * dir.y;
                p.vel.z -= vr * dir.z;
            }
        }
    }

    // Apply damping (aerodynamic drag) to the entire 3D velocity vector
    const damp = Math.pow(1 - damping, dt);
    p.vel.x *= damp;
    p.vel.y *= damp;
    p.vel.z *= damp;
}