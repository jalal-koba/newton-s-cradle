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

    const newX = p.pos.x + p.vel.x * dt + 0.5 * ax * dt * dt;
    const newY = p.pos.y + p.vel.y * dt + 0.5 * ay * dt * dt;

    p.prevPos = p.pos.clone();
    p.pos.x = newX;
    p.pos.y = newY;
    p.pos.z = 0;

    p.applyConstraint();

    p.vel.x = (p.pos.x - p.prevPos.x) / dt;
    p.vel.y = (p.pos.y - p.prevPos.y) / dt;
    p.vel.z = 0;

    const d = p.pos.sub(p.pivot).norm;
    const vr = d.dot(p.vel);
    const velR = d.scale(vr);
    const velT = p.vel.sub(velR);
    const damp = Math.pow(1 - damping, dt);
    p.vel.x = velR.x + velT.x * damp;
    p.vel.y = velR.y + velT.y * damp;
}