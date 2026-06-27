import { N_BALLS, BALL_MASS, updateN_BALLS, updateBALL_MASS } from '../core/config.js';

let physics;
let newtonCradle;
let maxEnergy = 0.01;

export function setupUI(physicsRef, newtonCradleRef) {
    physics = physicsRef;
    newtonCradle = newtonCradleRef;

    const restSlider = document.getElementById('rest-slider');
    const dampSlider = document.getElementById('damp-slider');
    const speedSlider = document.getElementById('speed-slider');
    const nballSlider = document.getElementById('nball-slider');
    const massSlider = document.getElementById('mass-slider');

    nballSlider.addEventListener('change', () => {
        const newValue = parseInt(nballSlider.value);
        updateN_BALLS(newValue);
        document.getElementById('nball-val').textContent = newValue;
        newtonCradle.rebuild();
    });
    nballSlider.addEventListener('input', () => {
        document.getElementById('nball-val').textContent = nballSlider.value;
    });

    massSlider.addEventListener('input', () => {
        const m = parseFloat(massSlider.value);
        document.getElementById('mass-val').textContent = m.toFixed(2);
        updateBALL_MASS(m);
        newtonCradle.updateMasses(m);
    });

    restSlider.addEventListener('input', () => {
        physics.restitution = +restSlider.value;
        document.getElementById('rest-val').textContent = (+restSlider.value).toFixed(2);
    });
    dampSlider.addEventListener('input', () => {
        physics.damping = +dampSlider.value;
        document.getElementById('damp-val').textContent = (+dampSlider.value).toFixed(2);
    });
    speedSlider.addEventListener('input', () => {
        physics.speedMult = +speedSlider.value;
        document.getElementById('speed-val').textContent = (+speedSlider.value).toFixed(2);
    });
    document.getElementById('reset-btn').addEventListener('click', () => physics.reset());
}

export function updateUI() {
    const { ke, pe } = physics.energy();
    const te = ke + pe;
    if (te > maxEnergy) maxEnergy = te;
    const keP = Math.min(100, (ke / maxEnergy) * 100).toFixed(1);
    const peP = Math.min(100, (pe / maxEnergy) * 100).toFixed(1);

    let momentum = 0;
    for (const p of physics.pendulums) {
        momentum += p.mass * Math.sqrt(p.vel.x * p.vel.x + p.vel.y * p.vel.y);
    }

    document.getElementById('ke-val').textContent = ke.toFixed(3) + ' J';
    document.getElementById('pe-val').textContent = pe.toFixed(3) + ' J';
    document.getElementById('te-val').textContent = te.toFixed(3) + ' J';
    document.getElementById('coll-val').textContent = physics.collisions;
    document.getElementById('mom-val').textContent = momentum.toFixed(3);
    document.getElementById('ke-bar').style.width = keP + '%';
    document.getElementById('pe-bar').style.width = peP + '%';
}

export function resetCollisionCount() {
    physics.collisions = 0;
    document.getElementById('coll-val').textContent = '0';
    maxEnergy = 0.01;
}