import {Gameboard} from "./gameboard.js";

class Player {
    constructor(rows, cols) {
        this.gameboard = new Gameboard(rows, cols);
    }
}

export class RealPlayer extends Player {
    constructor(rows, cols) {
        super(rows, cols);
    }
}

export class ComputerPlayer extends Player {
    constructor(rows, cols) {
        super(rows, cols);
    }
}