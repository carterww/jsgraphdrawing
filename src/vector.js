class Vector {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    subtract(vector) {
        return new Vector(this.x - vector.x, this.y - vector.y);
    }
    multiply(vector) {
        return new Vector(this.x * vector.x, this.y * vector.y);
    }
    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    euclideanDistance(vector) {
        return Math.sqrt(Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2));
    }
    normalize() {
        const norm = this.norm();
        return new Vector(this.x / norm, this.y / norm);
    }
    scale(scalar) {
        return new Vector(this.x * scalar, this.y * scalar);
    }
    normalize_() {
        const norm = this.norm();
        this.x /= norm;
        this.y /= norm;
    }
    scale_(scalar) {
        this.x *= scalar;
        this.y *= scalar;
    }

}
