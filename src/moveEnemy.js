class MoveEnemy {
    constructor(moveEnemyData, posX, posY, posZ, dir) {
        this.moveEnemyData = moveEnemyData;
        this.moveEnemyData.position.set(posX, posY, posZ);
        this.moveEnemyData.rotateX(Math.PI / 2);
        // this.moveEnemyData.rotateY(Math.PI);
        this.moveEnemyData.scale.set(0.4, 0.4, 0.4);
        this.moveDir = dir;
        this.inFrame = 1;

    }
    normalMove() {
        if (this.moveDir == 1)
            this.moveEnemyData.position.x += 0.1
        else {
            this.moveEnemyData.position.x -= 0.1
        }
    }
}

export { MoveEnemy }