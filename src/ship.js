export class Ship {
    constructor(length) {
        if (length < 0) {
            throw new Error("Ship length cannot be negative");
        } else if (!Number.isInteger(length)) {
            throw new Error("Ship length must be an integer");
        } 

        this.length = length;
        this.timesHit = 0;
        this.sunk = false;
    }

    hit() {
        this.timesHit++;
    }

    isSunk() {
        this.sunk = (this.timesHit >= this.length);
        return this.sunk;
    }
}

module.exports = Ship;