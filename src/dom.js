import {Gameboard} from "./gameboard.js";
import {Ship} from "./ship.js";
import {RealPlayer, ComputerPlayer} from "./player.js";

const ROWS = 10;
const COLS = 10;
const SHIP_LENGTHS = {
    "carrier": 5,
    "battleship": 4,
    "cruiser": 3,
    "submarine": 3,
    "destroyer": 2
}

/**
 * Takes an array of arrays and a target array as arguments and checks whether
 * the array of arrays contains the target array
 * @param {Array of Arrays} mainArray an array of arrays
 * @param {Array} targetArray array to check
 * @returns true if targetArray is contained in mainArray and false if it isn't
 */
export function arrayIsContained(mainArray, targetArray) {
    return mainArray.some(arr => 
      arr.length === targetArray.length && 
      arr.every((value, index) => value === targetArray[index])
    );
}
/**
 * Takes two nested arrays of integers representing the coordinates of two 
 * ships that have been placed on the board, and returns whether those two ships
 * overlap with each other on the board
 * @param {Integer Array of Arrays} shipCoords1 
 * @param {Integer Array of Arrays} shipCoords2 
 * @returns true if the ship coordinates overlap, false otherwise
 */
export function checkShipOverlap(shipCoords1, shipCoords2) {
    for (let i = 0; i < shipCoords1.length; i++) {
        if (arrayIsContained(shipCoords2, shipCoords1[i])) {
            return true;
        }
    }

    return false;
}

export function calculateCoords(shipType, orientation, startingRow, startingCol) {
    const shipLowerCase = shipType.toLowerCase();
    const orientationLowerCase = orientation.toLowerCase();

    if (!(shipLowerCase in SHIP_LENGTHS)) {
        throw new Error("calculateCoords requires a valid ship type");
    } else if (orientationLowerCase !== "horizontal" &&  
               orientationLowerCase !== "vertical") {
        throw new Error("calculateCoords requires a valid orientation");
    }

    let length = SHIP_LENGTHS[shipLowerCase];
    const coords = [];

    if (
        (orientation === "horizontal" && (Number(startingCol) + length) > COLS) ||
        (orientation === "vertical" && (Number(startingRow) + length) > ROWS) 
    ) {
        console.log(length);
        console.log(startingCol);
        console.log(startingCol + length);
        throw new Error(shipLowerCase + " does not fit on board; please " +
            "specify appropriate cooridinates");
    }

    if (orientationLowerCase === "horizontal") {
        while (length > 0) {
            coords.push([startingRow, startingCol + length - 1]);
            length--;
        }
    } else if (orientationLowerCase === "vertical") {
        while (length > 0) {
            coords.push([startingRow + length - 1, startingCol]);
            length--;
        }
    }

    return coords;
}

function getShipInputs(shipType) {
    const shipLowerCase = shipType.toLowerCase();

    if (!(shipLowerCase in SHIP_LENGTHS)) {
        throw new Error("getShipInputs requires a valid ship type");
    }

    const shipRow = document.getElementById(shipLowerCase + "-row").value;
    const shipCol = document.getElementById(shipLowerCase + "-col").value;
    const shipOri = document.getElementById(shipLowerCase + "-ori").value;

    if (shipRow === "" || shipCol === "") {
        return false;
    } else {
        return {
            "row": shipRow,
            "col": shipCol,
            "orientation": shipOri
        }
    }
}

function createBoard(boardType, rows, cols) {
    const boardContainer = document.createElement("div");
    boardContainer.setAttribute("class", boardType + "-board");

    for (let i = 0; i < ROWS; i++) {
        const rowContainer = document.createElement("div");
        rowContainer.setAttribute("class", "row");

        for (let i = 0; i < COLS; i++) {
            const colContainer = document.createElement("div");
            colContainer.setAttribute("class", "space");
            rowContainer.appendChild(colContainer);
        }

        boardContainer.appendChild(rowContainer);
    }

    return boardContainer;
}

function displayBoard() {
    document.body.innerHTML = "";

    const boardContainer = document.createElement("div");
    boardContainer.setAttribute("class", "board");

    boardContainer.appendChild(createBoard("player", ROWS, COLS));
    boardContainer.appendChild(createBoard("computer", ROWS, COLS));

    document.body.appendChild(boardContainer);
}

export function getShipCoords() {
    const startButton = document.querySelector(".start-game");
    const errorMessageDiv = document.getElementById("error-message");

    startButton.addEventListener("click", () => {
        const coordList = [];
        let overlapDetected = false;

        errorMessageDiv.style.display = "none";

        for (let ship in SHIP_LENGTHS) {
            const shipInputs = getShipInputs(ship);

            if (!shipInputs) {
                alert("Please enter row and column numbers for all ships");
                return;
            }
            
            const shipCoords = calculateCoords(
                ship, 
                shipInputs["orientation"],
                shipInputs["row"],
                shipInputs["col"]
            );
            coordList.push(shipCoords);
        }

        for (let i = 0; i < coordList.length - 1; i++) {
            if (checkShipOverlap(coordList[i], coordList[i + 1])) {
                overlapDetected = true;
                break;
            }
        }

        if (overlapDetected) {
            errorMessageDiv.textContent = 
                "The coordinates you entered are invalid because they " +
                "would cause at least two of the ships to overlap on the " +
                "gameboard. Please enter valid coordinates.";
            errorMessageDiv.style.display = "block"; 
        } else {
            displayBoard();
        }
    });
}