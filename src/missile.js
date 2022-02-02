class Missile {
    constructor(missileData, posX, posY, posZ) {
        this.missileData = missileData;
        this.missileData.position.set(posX, posY, posZ);
        this.missileData.rotation.x += (Math.PI / 2);
        this.missileData.scale.set(0.005, 0.005, 0.005);
        this.inFrame = 1;
    }
    move() {
        this.missileData.position.y += 0.15 * 2;
        this.missileData.rotation.z += 0.1;
    }
}

export { Missile }