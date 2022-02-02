class Rock {
    constructor(rockData, posX, posY, posZ) {
        this.rockData = rockData;
        this.rockData.position.set(posX, posY, posZ);
        this.rockData.rotation.x += (Math.PI / 2) * Math.random();
        // this.starData.rotateX(Math.PI / 2);
        this.rockData.scale.set(0.8, 0.8, 0.8);
        this.rowNum = Math.floor((posY - 13) / 30)

        var k = Math.random()
        if (k < 0.5) {
            this.rotSpeedTimes = 1;
        }
        else {
            this.rotSpeedTimes = 2;
        }
        this.inFrame = 1;
    }
    setRotation() {
        this.rockData.rotation.x += this.rotSpeedTimes * Math.PI / 180;
        this.rockData.rotation.y += this.rotSpeedTimes * Math.PI / 180;

    }
}

export { Rock }