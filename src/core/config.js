let _nBalls = 5;
let _ballMass = 1.0;

export function getN_BALLS() { return _nBalls; }
export function setN_BALLS(val) { _nBalls = val; }
export const N_BALLS = { get value() { return _nBalls; } };

export function getBALL_MASS() { return _ballMass; }
export function setBALL_MASS(val) { _ballMass = val; }
export const BALL_MASS = { get value() { return _ballMass; } };

export function updateN_BALLS(val) { _nBalls = val; }
export function updateBALL_MASS(val) { _ballMass = val; }

export const DEFAULT_RESTITUTION = 1.0;
export const DEFAULT_DAMPING = 0.05;
export const DEFAULT_SPEED_MULT = 1.0;
export const GRAVITY = 9.81;

export const PHYSICS_SUB_STEPS = 12;
export const PHYSICS_OVERLAP_PASSES = 8;
export const PHYSICS_VELOCITY_ITERATIONS = 30;
export const PHYSICS_MAX_DT = 0.033;

export const CAMERA_FOV = 42;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 120;
export const CAMERA_POSITION_X = 0;
export const CAMERA_POSITION_Y = 1.8;
export const CAMERA_POSITION_Z = 13;
export const ORBIT_TARGET_X = 0;
export const ORBIT_TARGET_Y = 0.5;
export const ORBIT_TARGET_Z = 0;
export const ORBIT_DAMPING_FACTOR = 0.06;
export const ORBIT_MAX_POLAR_ANGLE = Math.PI * 0.58;
export const FOG_DENSITY = 0.018;
export const SHADOW_MAP_SIZE = 2048;
export const SHADOW_CAMERA_NEAR = 0.5;
export const SHADOW_CAMERA_FAR = 35;
export const SHADOW_BIAS = -0.0004;
export const TONE_MAPPING_EXPOSURE = 1.1;
export const MAX_PIXEL_RATIO = 2;
export const MAX_ENERGY_INIT = 0.01;