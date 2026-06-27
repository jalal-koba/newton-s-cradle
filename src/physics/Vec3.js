export class Vec3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    add(v) {
        return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z);
    }

    sub(v) {
        return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z);
    }

    scale(s) {
        return new Vec3(this.x * s, this.y * s, this.z * s);
    }

    divS(s) {
        return s === 0 ? new Vec3() : new Vec3(this.x / s, this.y / s, this.z / s);
    }

    get mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    get norm() {
        const m = this.mag;
        return m < 1e-12 ? new Vec3() : new Vec3(this.x / m, this.y / m, this.z / m);
    }

    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }

    clone() {
        return new Vec3(this.x, this.y, this.z);
    }

    copyTo(v) {
        v.x = this.x;
        v.y = this.y;
        v.z = this.z;
    }
}