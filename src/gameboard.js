import { Ship } from "./ship";
import { arrayIsContained } from "./dom";

/**
 * Class that is used to represent a player's gameboard. Stores the size and
 * internal representation of their board, where they placed their ships, and
 * which spaces have been attacked and which resulted in misses (the ship
 * representations store the hits)
 */
export class Gameboard {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    // Initialize the board as a nested array of '_' characters, where '_'
    // represents a space that has not been attacked yet
    this.board = Array(this.rows)
      .fill()
      .map(() => Array(this.cols).fill("_"));
    this.misses = [];
    this.ships = [];
    this.attackedSpaces = [];
  }

  /**
   * Function used to place ships on the board
   * @param {Number} row the row on which to place the top/left-most part of
   * the ship
   * @param {Number} col the column on which to place the top/left-most part of
   * the ship
   * @param {Number} shipLength the number of spaces the ship takes up
   * @param {String} orientation a string that is either 'horizontal' or
   * 'vertical', specifying the ship's orientation ont he board
   * @returns true if the ship was successfully placed; otherwise throws an
   * error indicating an issue with the specified parameters for placing the
   * ship
   */
  placeShip(row, col, shipLength, orientation) {
    const newShip = new Ship(shipLength);
    // Make sure the specified coordinates aren't outside the bounds of the
    // board
    if (
      row < 0 ||
      col < 0 ||
      row >= this.board.length ||
      col >= this.board[0].length
    ) {
      throw new Error(
        "Coordinates out of bounds. Please enter valid " + "coordinates"
      );
      // Make sure the specified parameters result in the ship fitting on the
      // board
    } else if (
      (orientation === "vertical" && row + shipLength > this.board.length) ||
      (orientation === "horizontal" && col + shipLength > this.board[0].length)
    ) {
      throw new Error("Ship is too long. Please enter a valid ship length");
    }

    if (orientation === "horizontal") {
      // Make sure the ship's placement will not result in it overlapping with
      // any other ships before placing it
      for (let i = 0; i < shipLength; i++) {
        if (this.board[row][col + i] !== "_") {
          throw new Error(
            "Cannot place ship here because it " + "overlaps with another ship"
          );
        }
      }

      for (let i = 0; i < shipLength; i++) {
        this.board[row][col + i] = newShip;
      }

      this.ships.push(newShip);
      // Make sure the ship's placement will not result in it overlapping with
      // any other ships before placing it
    } else if (orientation === "vertical") {
      for (let i = 0; i < shipLength; i++) {
        if (this.board[row + i][col] !== "_") {
          throw new Error(
            "Cannot place ship here because it " + "overlaps with another ship"
          );
        }
      }

      for (let i = 0; i < shipLength; i++) {
        this.board[row + i][col] = newShip;
      }

      this.ships.push(newShip);
    } else {
      // Not sure this is really necessary because given how the rest
      // of the code is set up I don't think any other orientation
      // could be specified, but I left it in as a failsafe in case
      // I decide to alter the code later in a way that makes this
      // error checking necessary
      throw new Error(
        "Please specify either 'horizontal' or 'vertical' " +
          "for the orientation of the ship"
      );
    }

    return true;
  }

  /**
   * Function to handle attacks of ships on the gameboard
   * @param {Number} row the row of the space to be attacked
   * @param {Number} col the column of the space to be attacked
   * @returns true if the attack was a hit or false if it was a miss; throws
   * an error if the specified coordinates are notwithin the bounds of the
   * board or if the specified space has already been attacked
   */
  receiveAttack(row, col) {
    if (
      row < 0 ||
      col < 0 ||
      row >= this.board.length ||
      col >= this.board[0].length
    ) {
      throw new Error(
        "Coordinates out of bounds. Please enter valid " + "coordinates"
      );
    } else if (arrayIsContained(this.attackedSpaces, [row, col])) {
      throw new Error("This space has already been attacked");
    } else if (this.board[row][col] === "_") {
      this.misses.push([row, col]);
      this.attackedSpaces.push([row, col]);
      return false;
    } else {
      this.board[row][col].hit();
      this.attackedSpaces.push([row, col]);
      return true;
    }
  }

  /**
   * Function that asseses whether all of the ships on this board have been
   * sunk
   * @returns true if all ships have been sunk, false otherwise
   */
  shipsSunk() {
    // Handle case where there are no ships on the board; shouldn't come up
    // in practice as the game is currently set up
    if (this.ships.length === 0) {
      return false;
    }

    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) {
        return false;
      }
    }

    return true;
  }

  /**
   * Function to return all the space on this board that have been attacked
   * and such attack resulted in a miss; don't think this is currently used
   * elsewhere
   * @returns list of arrays of length two, each representing the row and
   * column of a space that has been attacked and resulted in a miss
   */
  showMisses() {
    return this.misses;
  }

  /**
   * Function to return all the space on this board that have been attacked;
   * don't think this is currently used elsewhere
   * @returns list of arrays of length two, each representing the row and
   * column of a space that has been attacked
   */
  showAttackedSpaces() {
    return this.attackedSpaces;
  }

  /**
   * Function that shows the current state of the gameboard. Don't think I
   * ever actually used this anywhere but could probably have used it in place
   * of the getGameboard function that I added to the Player class
   * @returns a nested array representing the current state of the gameboard
   */
  showBoard() {
    return this.board;
  }
}
