import { Gameboard } from "./gameboard.js";

/**
 * Class used to represent a player of the game (whether real or computer) which
 * stores both the internal and HTML representation of the player's board
 */
class Player {
  constructor(rows, cols, board) {
    this.gameboard = new Gameboard(rows, cols);
    this.htmlBoard = board;
  }

  /**
   *
   * @returns {Gameboard} the internal representation of the player's
   * gameboard
   */
  getGameboard() {
    return this.gameboard;
  }
}

/**
 * Class used to represent the user and store their board
 */
export class RealPlayer extends Player {
  constructor(rows, cols, board) {
    super(rows, cols, board);
  }
}

/**
 * Class used to represent the computer and store their board
 */
export class ComputerPlayer extends Player {
  constructor(rows, cols, board) {
    super(rows, cols, board);
  }
}
