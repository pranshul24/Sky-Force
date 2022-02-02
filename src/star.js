class Star {
    constructor(starData, posX, posY, posZ) {
        this.starData = starData;
        this.starData.position.set(posX, posY, posZ);
        this.starData.rotation.x += (Math.PI / 2) * Math.random();
        this.starData.scale.set(0.3, 0.3, 0.3);
        this.rowNum = Math.floor((posY - 3) / 30)
        var k = Math.random()
        if (k < 0.25) {
            this.rotSpeedTimes = 1;
        }
        else if (k < 0.5) {
            this.rotSpeedTimes = 2;
        }
        else if (k < 0.75) {
            this.rotSpeedTimes = 3;
        }
        else {
            this.rotSpeedTimes = 4;
        }
        this.inFrame = 1;
    }
    setRotation() {
        this.starData.rotation.x += this.rotSpeedTimes * Math.PI / 180;
    }
}

export { Star }