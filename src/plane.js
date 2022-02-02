class Plane {
    constructor(planeData, posX, posY, posZ) {
        this.planeData = planeData;
        this.planeData.position.set(posX, posY, posZ);
        this.planeData.rotateX(Math.PI / 2);
        this.planeData.rotateY(Math.PI);
        this.planeData.scale.set(0.5, 0.5, 0.5);
        this.rotVal = 0;
        this.toMoveX = 100;
        this.toMoveXMid = 100;
        this.toMoveDir = 0;//1 for left , 2 for right
        this.normRotationZ = this.planeData.rotation.z;
    }
    setRotation() {
        this.planeData.rotation.x += Math.PI / 180;
    }
    setPosX(valX) {
        this.planeData.position.x += valX;
    }
    setPosY(valY) {
        this.planeData.position.y += valY;
    }
    setPosZ(valZ) {
        this.planeData.position.z += valZ;
    }
    moveL() {
        this.planeData.position.x -= 0.3;
        if (this.toMoveDir == 1) {
            if (this.planeData.position.x <= this.toMoveXMid) {
                this.planeData.rotation.z += 0.02;
            }
            else {
                this.planeData.rotation.z -= 0.02;
            }
        }

        if (this.planeData.position.x <= this.toMoveX) {
            this.planeData.position.x = this.toMoveX;
            this.planeData.rotation.z = this.normRotationZ;
            return 1;
        }
        else {
            return 0;
        }
    }
    moveR() {
        this.planeData.position.x += 0.3;
        if (this.toMoveDir == 2) {
            if (this.planeData.position.x >= this.toMoveXMid) {
                this.planeData.rotation.z -= 0.02;
            }
            else {
                this.planeData.rotation.z += 0.02;
            }
        }
        if (this.planeData.position.x >= this.toMoveX) {
            this.planeData.position.x = this.toMoveX;
            return 1;
        }
        else {
            return 0;
        }
    }
    normalMove() {
        this.planeData.position.y += 0.1
    }
}

export { Plane }