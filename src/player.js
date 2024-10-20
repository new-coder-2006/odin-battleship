import {Gameboard} from "./gameboard.js";

class Player {
    constructor(rows, cols, board) {
        this.gameboard = new Gameboard(rows, cols);
        this.htmlBoard = board;
    }

    getGameboard() {
        return this.gameboard;
    }
}

export class RealPlayer extends Player {
    constructor(rows, cols, board) {
        super(rows, cols, board);
    }
}

export class ComputerPlayer extends Player {
    constructor(rows, cols, board) {
        super(rows, cols, board);
    }
}