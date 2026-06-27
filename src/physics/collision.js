import { Vec3 } from './Vec3.js';

let playClickCallback = null;
export function setPlayClickCallback(callback) {
    playClickCallback = callback;
}

export function resolveOverlap(a, b, restitution) {
    const n = b.pos.sub(a.pos);
    const dist = n.mag;
    const minDist = a.radius + b.radius;
    const overlap = minDist - dist;
    if (overlap <= 1e-6) return;

    const normal = n.norm;
    const va = Math.abs(a.vel.dot(normal));
    const vb = Math.abs(b.vel.dot(normal));
    const total = va + vb;
    let wa = 0.5, wb = 0.5;
    if (total > 1e-4) { wa = va / total; wb = vb / total; }
    if (a.isDragged) { wa = 0; wb = 1; }
    if (b.isDragged) { wa = 1; wb = 0; }

    if (!a.isDragged) {
        a.pos = a.pos.sub(normal.scale(overlap * wa));
        a.applyConstraint();
    }
    if (!b.isDragged) {
        b.pos = b.pos.add(normal.scale(overlap * wb));
        b.applyConstraint();
    }
}

export function resolveVelocity(a, b, restitution, countHit) {
    const n = b.pos.sub(a.pos);
    const dist = n.mag;
    if (dist > a.radius + b.radius + 0.002) return false;

    const normal = n.norm;
    const van = a.vel.dot(normal);
    const vbn = b.vel.dot(normal);
    if (van - vbn <= 1e-4) return false;

    const e = restitution;
    const m1 = a.mass, m2 = b.mass;
    const j = (1 + e) * (van - vbn) / (1 / m1 + 1 / m2);
    if (!a.isDragged) {
        a.vel.x -= (j / m1) * normal.x;
        a.vel.y -= (j / m1) * normal.y;
    }
    if (!b.isDragged) {
        b.vel.x += (j / m2) * normal.x;
        b.vel.y += (j / m2) * normal.y;
    }
    if (countHit) {
        const impactSpeed = Math.abs(van - vbn);
        const intensity = Math.min(1.0, impactSpeed / 6);
        if (playClickCallback) {
            playClickCallback(intensity);
        }
    }
    return true;
}