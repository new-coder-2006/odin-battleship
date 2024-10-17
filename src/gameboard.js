import { Ship } from "./ship";
import { arrayIsContained } from "./dom";

export class Gameboard {
    constructor(rows, cols) {
        this.board = Array(rows).fill().map(() => Array(cols).fill('_'));
        this.misses = [];
        this.ships = [];
        this.attackedSpaces = [];
    }

    placeShip(row, col, shipLength, orientation) {
        const newShip = new Ship(shipLength);
        if (
            row < 0 || 
            col < 0 || 
            row >= this.board.length || 
            col >= this.board[0].length 
        ) {
            throw new Error("Coordinates out of bounds. Please enter valid " +
                "coordinates");
        }  else if (
            ((orientation === "vertical") && ((row + shipLength) > 
                this.board.length)) ||
            ((orientation === "horizontal") && ((col + shipLength) > 
                this.board[0].length))
        ) {
            throw new Error("Ship is too long. Please enter a valid ship length");
        }

        if (orientation === "horizontal") {
            for (let i = 0; i < shipLength; i++) {
                if (this.board[row][col + i] !== "_") {
                    throw new Error("Cannot place ship here because it " +
                        "overlaps with another ship");
                } else {
                    this.board[row][col + i] = newShip;
                    this.ships.push(newShip);
                }
            }
        } else if (orientation === "vertical") {
            for (let i = 0; i < shipLength; i++) {
                if (this.board[row + i][col] !== "_") {
                    throw new Error("Cannot place ship here because it " + 
                        "overlaps with another ship");
                } else {
                    this.board[row + i][col] = newShip;
                    this.ships.push(newShip);
                }
            }
        } else {
            throw new Error("Please specify either 'horizontal' or 'vertical' " +
                "for the orientation of the ship");
        }

        return true;
    }

    receiveAttack(row, col) {
        if (
            row < 0 || 
            col < 0 || 
            row >= this.board.length || 
            col >= this.board[0].length
        ) {
            throw new Error("Coordinates out of bounds. Please enter valid " +
                "coordinates");
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

    shipsSunk() {
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

    showMisses() {
        return this.misses;
    }

    showAttackedSpaces() {
        return this.attackedSpaces;
    }
}