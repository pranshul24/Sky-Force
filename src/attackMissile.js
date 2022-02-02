class AttackMissile {
    constructor(attackMissileData, posX, posY, posZ, planePosX, planePosY) {
        this.attackMissileData = attackMissileData;
        this.attackMissileData.position.set(posX, posY, posZ);
        this.attackMissileData.rotation.x += (3 * Math.PI / 2);
        this.attackMissileData.scale.set(0.004, 0.004, 0.004);
        this.moveL = 1.5 * (planePosX - posX) / (planePosY - posY);
        this.inFrame = 1;
    }
    move() {
        this.attackMissileData.position.y -= 0.1 * 2;
        this.attackMissileData.position.x -= 0.1 * 2 * this.moveL;
        this.attackMissileData.rotation.z += 0.1;
    }
}

export { AttackMissile }