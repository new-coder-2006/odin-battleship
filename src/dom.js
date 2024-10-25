import { RealPlayer, ComputerPlayer } from "./player.js";
import carrier from "./images/carrier.png";
import battleship from "./images/battleship.png";
import cruiser from "./images/cruiser.png";
import submarine from "./images/submarine.png";
import destroyer from "./images/destroyer.png";
import blast from "./images/blast.png";
import miss from "./images/x.png";
import loser from "./images/loser.jpg";
import winnerImage from "./images/winner.jpg";

const ROWS = 10;
const COLS = 10;
const SHIP_LENGTHS = {
  carrier: 5,
  battleship: 4,
  cruiser: 3,
  submarine: 3,
  destroyer: 2,
};
// Store images of ships to be placed on the player's board
const SHIP_ICONS = {
  carrier: carrier,
  battleship: battleship,
  cruiser: cruiser,
  submarine: submarine,
  destroyer: destroyer,
};

/**
 * Takes an array of arrays and a target array as arguments and checks whether
 * the array of arrays contains the target array
 * @param {Array of Arrays} mainArray an array of arrays
 * @param {Array} targetArray array to check
 * @returns true if targetArray is contained in mainArray and false if it isn't
 */
export function arrayIsContained(mainArray, targetArray) {
  return mainArray.some(
    (arr) =>
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

/**
 * Function that calculates the list of coordinates covered by a ship based on
 * the orientation, starting row, and starting column specified by the player
 * or coomputer
 * @param {String} shipType the type of ship for which coordinates are being
 * calculated
 * @param {String} orientation the orientation of the ship
 * @param {String} startingRow the row that the left/top-most part of the ship
 * is placed on
 * @param {String} startingCol the column that the left/top-most part of the ship is
 * placed on
 * @returns a nested array of pairs of numbers representing the set of
 * coordinates covered by the ship
 */
export function calculateCoords(
  shipType,
  orientation,
  startingRow,
  startingCol
) {
  // Ensure the name of the ship matches the formatting in SHIP_LENGTHS
  const shipLowerCase = shipType.toLowerCase();
  const orientationLowerCase = orientation.toLowerCase();

  if (!(shipLowerCase in SHIP_LENGTHS)) {
    throw new Error("calculateCoords requires a valid ship type");
  } else if (
    orientationLowerCase !== "horizontal" &&
    orientationLowerCase !== "vertical"
  ) {
    throw new Error("calculateCoords requires a valid orientation");
  }

  let length = SHIP_LENGTHS[shipLowerCase];
  const coords = [];

  if (
    (orientation === "horizontal" && Number(startingCol) + length > COLS + 1) ||
    (orientation === "vertical" && Number(startingRow) + length > ROWS + 1)
  ) {
    throw new Error(
      shipLowerCase +
        " does not fit on board; please " +
        "specify appropriate cooridinates"
    );
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

/**
 * Function to retrieve the inputs a player has specified for a given ship when
 * setting up his or her board on the start screen
 * @param {String} shipType the type of ship for which inputs are being
 * retrieved
 * @returns if a row and column has been specified for each ship, returns an object
 * containing the type of ship, the row and column specified by the player
 * for the placement of the ship, and the orientation of the ship specified by
 * the player. However, if the player did not specify a row or column for any of
 * the ships, returns false.
 */
function getShipInputs(shipType) {
  // Ensure the shipType is formatted in a way that matches the format of ship
  // names in SHIP_LENGTHS
  const shipLowerCase = shipType.toLowerCase();

  if (!(shipLowerCase in SHIP_LENGTHS)) {
    throw new Error("getShipInputs requires a valid ship type");
  }

  const shipRow = document.getElementById(shipLowerCase + "-row").value;
  const shipCol = document.getElementById(shipLowerCase + "-col").value;
  const shipOri = document.getElementById(shipLowerCase + "-ori").value;
  // Note: no need to check whether an orientation has been provided, because
  // that is chosen from a dropdown list that defaults to 'horizontal'
  if (shipRow === "" || shipCol === "") {
    return false;
  } else {
    return {
      ship: shipType,
      row: Number(shipRow),
      col: Number(shipCol),
      orientation: shipOri,
    };
  }
}

/**
 * Function that is used to create the HTML to display either the player's
 * board or the computer's board, depending on the specified board type
 * @param {String} boardType a string that must be either 'player' or 'computer'
 * @param {Number} rows the number of rows on the board
 * @param {Number} cols the number of columsn on the board
 * @param {Object} shipInputs an object containing the row, column, and
 * orientation specified for the placement of each ship
 * @returns a div representing the HTML container that holds the specified board
 */
function createBoard(boardType, rows, cols, shipInputs) {
  const boardContainer = document.createElement("div");
  // One board has class 'player-board' and the other has class 'computer-board'
  boardContainer.setAttribute("class", boardType + "-board");

  for (let i = 0; i < rows; i++) {
    const rowContainer = document.createElement("div");
    rowContainer.setAttribute("class", "row");

    for (let j = 0; j < cols; j++) {
      const colContainer = document.createElement("div");
      colContainer.setAttribute("class", "space");
      // Player spaces have ids of format 'p[ROW#][COL#]' and computer
      // spaces have ids of format 'c[ROW#][COL#]'
      colContainer.setAttribute("id", boardType[0] + String(i) + String(j));
      // Display images of the applicable ships on the player's board
      // at the locations where the player has placed them
      if (boardType === "player") {
        for (let k = 0; k < shipInputs.length; k++) {
          if (arrayIsContained(shipInputs[k]["shipCoords"], [i + 1, j + 1])) {
            const shipIcon = document.createElement("img");
            shipIcon.setAttribute("class", "ship-icon");
            shipIcon.src = SHIP_ICONS[shipInputs[k]["ship"]];
            shipIcon.alt = shipInputs[k]["ship"];
            colContainer.appendChild(shipIcon);
            break;
          }
        }
      }

      rowContainer.appendChild(colContainer);
    }

    boardContainer.appendChild(rowContainer);
  }

  return boardContainer;
}

/**
 * Function that handles the creation of the overall board by calling createBoard
 * for both the player's board and the computer's board and labeling each
 * @param {Object} shipInputs object containing the specified row, column and
 * orientation for the placement of each ship
 * @returns object that contains two divs: one containing the player's board
 * and one containing the computer's board
 */
function displayBoard(shipInputs) {
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";

  const boardContainer = document.createElement("div");
  boardContainer.setAttribute("class", "board");

  const playerBoard = createBoard("player", ROWS, COLS, shipInputs);
  const computerBoard = createBoard("computer", ROWS, COLS, shipInputs);

  boardContainer.appendChild(playerBoard);
  boardContainer.appendChild(computerBoard);

  const playerBoardLabel = document.createElement("h1");
  playerBoardLabel.textContent = "Your Board";
  playerBoardLabel.setAttribute("class", "board-label");
  boardContainer.appendChild(playerBoardLabel);

  const computerBoardLabel = document.createElement("h1");
  computerBoardLabel.textContent = "Computer's Board";
  computerBoardLabel.setAttribute("class", "board-label");
  boardContainer.appendChild(computerBoardLabel);

  mainContainer.appendChild(boardContainer);

  return { player: playerBoard, computer: computerBoard };
}

/**
 * Function that takes as input an instance of the ComputerPlayer class and
 * randomly selects locations and orientations to use for the placement of the
 * computer's ships
 * @param {ComputerPlayer} computer an instance of the ComputerPlayer class
 */
function placeComputerShips(computer) {
  const computerGameboard = computer.getGameboard();
  // Maintain a list of possible spaces to place the computer's ships, which
  // will be updated to remove any spaces where a ship has been placed to
  // ensure multiple ships cannot be placed on any single space
  let possibleSpaces = [];

  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      // Represent possible spaces as strings for ease with representing
      // the first row and first column, which have leading 0's
      possibleSpaces.push(String(i) + String(j));
    }
  }

  for (let ship in SHIP_LENGTHS) {
    // Track whether the ship was successfully placed. Keep trying to place
    // it until it is
    let placed = false;
    // For each ship, try generating a random row, a random column, and a
    // random orientation. If this results in an error, try again.
    // Otherwise, the ship was successfully placed.
    while (!placed) {
      try {
        const randomRow = Math.floor(Math.random() * 10);
        const randomColumn = Math.floor(Math.random() * 10);
        // Generate a random orientation by generating either a 0 or a
        // 1. Set the orientation as 'horizontal' if 0, 'vertical; if 1.
        const randomOrientation = Math.floor(Math.random() * 2);
        let orientation;

        if (randomOrientation === 0) {
          orientation = "horizontal";
        } else {
          orientation = "vertical";
        }

        computerGameboard.placeShip(
          randomRow,
          randomColumn,
          SHIP_LENGTHS[ship],
          orientation
        );
        // If placeShip doesn't throw an error, the ship was
        // successfully placed so the while loop can be terminated
        // for this ship
        placed = true;
        // Calculate each coordinate that the ship was placed over
        // so that those coordinates can be removed from the list of
        // possible spaces
        const shipCoords = calculateCoords(
          ship,
          orientation,
          randomRow,
          randomColumn
        );
        possibleSpaces = possibleSpaces.filter(
          (space) =>
            !arrayIsContained(shipCoords, [Number(space[0]), Number(space[1])])
        );
      } catch (error) {
        // Make sure the while loop runs again if the ship was not
        // successfully placed
        placed = false;
      }
    }
  }
}

/**
 * Function used for placing the player's ships on their board based on the
 * inputs they specify on the start screen
 * @param {RealPlayer} player an instance of the RealPlayer class
 * @param {Array} inputs a list of the inputs that the player specified for
 * each ship
 */
function placePlayerShips(player, inputs) {
  const playerBoard = player.getGameboard();
  for (let i = 0; i < inputs.length; i++) {
    playerBoard.placeShip(
      // Rows and columns are 1-indexed for the player on the start screen
      // but are 0-indexed in the internal representation of the gameboard,
      // so need to subtract 1 from the row and column specified by the
      // player
      inputs[i]["row"] - 1,
      inputs[i]["col"] - 1,
      SHIP_LENGTHS[inputs[i]["ship"]],
      inputs[i]["orientation"]
    );
  }
}

/**
 * Function to display either 'You won!' or 'You lost!' along with the applicable
 * image upon the conclusion of the game
 * @param {String} winner either 'player' or 'computer'
 */
function displayWinnerScreen(winner) {
  // Remove the header used to notify the player that it is their turn
  const turnHeader = document.querySelector(".turn");
  turnHeader.remove();
  // Add a header announcing whether the player won or lost
  const header = document.querySelector(".header");
  const winAnnouncement = document.createElement("h1");
  winAnnouncement.setAttribute("class", "win-announcement");
  // Clear the board from the screen and replace it with a container for an
  // image that varies depending on whether the player won or lost
  const mainContainer = document.querySelector(".main-container");
  mainContainer.innerHTML = "";
  const resultImage = document.createElement("img");
  resultImage.setAttribute("class", "result-image");

  if (winner === "player") {
    winAnnouncement.textContent = "You won!";
    resultImage.src = winnerImage;
    resultImage.alt = "Image of a triumphant woman";
  } else {
    winAnnouncement.textContent = "You lost!";
    resultImage.src = loser;
    resultImage.alt = "Image of a red neon sign that says 'Loser'";
  }
  // Create a button to give the player the option to play a new game; reloads
  // the page if clicked and thereby returns the player to the input screen
  const playAgain = document.createElement("button");
  playAgain.setAttribute("class", "play-again");
  playAgain.textContent = "Play Again?";
  playAgain.addEventListener("click", () => {
    location.reload();
  });

  header.appendChild(winAnnouncement);
  header.appendChild(resultImage);
  header.appendChild(playAgain);
}

/**
 * Function to handle when the player clicks on a space on the computer's board
 * during their turn
 * @param {Event} event event the target of which represents the space that was
 * clicked
 * @param {Gameboard} computerGameboard an instance of the Gameboard class
 * representing the computer's board
 * @param {Function} turn the function that handles one turn of the game
 * @param {HTMLDivElement} playerBoard a div element representing the player's
 * gameboard
 * @param {HTMLDivElement} computerBoard a div element representing the
 * computer's gameboard
 * @param {RealPlayer} player an instance of the RealPlayer class representing
 * the player
 * @param {ComputerPlayer} computer an instance of the ComputerPlayer class
 * representing the computer
 * @returns {void} no return value, the function returns after calling
 * displayWinnerScreen when all of the computer's ships are determined to be
 * sunk
 */
function handleSpaceClick(
  event,
  computerGameboard,
  turn,
  playerBoard,
  computerBoard,
  player,
  computer
) {
  // The space that was clicked
  const space = event.target;
  // Space ids are of the format 'cNN' or 'pNN' so the row of the space is
  // the first index of the id string and the column is the second index
  const row = Number(space.id[1]);
  const col = Number(space.id[2]);

  try {
    const attacked = computerGameboard.receiveAttack(row, col);
    // If the attack did not trigger an error, set the space to display the
    // appropriate picture depending on whether the attack was a hit or miss
    if (attacked) {
      const blastIcon = document.createElement("img");
      blastIcon.setAttribute("class", "blast-icon");
      blastIcon.src = blast;
      blastIcon.alt = "This space has previously been attacked and was a hit";
      space.appendChild(blastIcon);
    } else {
      const missIcon = document.createElement("img");
      missIcon.setAttribute("class", "miss-icon");
      missIcon.src = miss;
      missIcon.alt = "This space has previously been attacked and was a miss";
      space.appendChild(missIcon);
    }

    // After an attack, check whether the game is over and if not, move
    // to the next turn
    if (computerGameboard.shipsSunk()) {
      displayWinnerScreen("player");
      return;
    } else {
      // If the player hasn't won, call turn with playerTurn set to false
      // so the computer can have its turn
      turn(playerBoard, computerBoard, false, player, computer);
    }
  } catch (error) {
    console.log(error);
    alert("Please click on a valid space to attack");
  }
}

/**
 * Function to handle a turn of the game
 * @param {HTMLDivElement} playerBoard a div representing the player's gameboard
 * @param {HTMLDivElement} computerBoard a div representing the computer's
 * gameboard
 * @param {Boolean} playerTurn a Boolean representing whether or not it is the
 * player's turn
 * @param {RealPlayer} player an instance of the RealPlayer class
 * @param {ComputerPlayer} computer an instance of the ComputerPlayer class
 * @returns {void} no return value, the function returns after calling
 * displayWinnerScreen when all of the player's ships are determined to be
 * sunk (note that determination of whether the computer's ships have been sunk)
 * is handled in handleSpaceClick above
 */
function turn(playerBoard, computerBoard, playerTurn, player, computer) {
  const computerGameboard = computer.getGameboard();
  const playerGameboard = player.getGameboard();
  const spaces = computerBoard.querySelectorAll(".space");
  const turnHeader = document.querySelector(".turn");

  if (playerTurn) {
    const yourTurn = document.createElement("h1");
    // This alerts the user that it is their turn and that they should click
    // a space on the computer's board. If the connection is fast enough,
    // this will pretty much display all the time because the computer's
    // attacks will be instantaneous, but I left it in case there is a
    // slower connection for some reason and it would be useful to alert
    // the user when it is their turn
    yourTurn.textContent =
      "It's your turn! Click a space on the computer's board to attack!";
    turnHeader.appendChild(yourTurn);
    // If it is the player's turn, add event listeners to the computer's
    // board spaces; once: true ensures the event listener is triggered
    // once per space
    spaces.forEach((space) => {
      space.addEventListener(
        "click",
        (event) =>
          handleSpaceClick(
            event,
            computerGameboard,
            turn,
            playerBoard,
            computerBoard,
            player,
            computer
          ),
        { once: true }
      );
    });
  } else {
    // Remove the notification that it is the player's turn if it is the
    // computer's turn
    turnHeader.textContent = "";
    // Remove the event listeners from the computer's board if it is not
    // the player's turn
    spaces.forEach((space) => {
      space.replaceWith(space.cloneNode(true));
    });
    try {
      // Pick a random space to attack on the player's board
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      const attacked = playerGameboard.receiveAttack(row, col);
      const attackedSpace = document.getElementById(
        "p" + String(row) + String(col)
      );
      // If the attack didn't trigger an error, display the appropriate
      // image signifying either a hit or a miss
      if (attacked) {
        // If the attack was a hit, clear the ship image from the space
        // so the blast icon can be displayed
        attackedSpace.innerHTML = "";
        const blastIcon = document.createElement("img");
        blastIcon.setAttribute("class", "blast-icon");
        blastIcon.src = blast;
        blastIcon.alt = "This space has previously been attacked and was a hit";
        if (attackedSpace.firstChild) {
          attackedSpace.insertBefore(blastIcon, attackedSpace.firstChild);
        } else {
          attackedSpace.appendChild(blastIcon);
        }
      } else {
        const missIcon = document.createElement("img");
        missIcon.setAttribute("class", "miss-icon");
        missIcon.src = miss;
        missIcon.alt = "This space has previously been attacked and was a miss";
        attackedSpace.appendChild(missIcon);
      }

      if (playerGameboard.shipsSunk()) {
        displayWinnerScreen("computer");
        return;
      } else {
        // If the game is not over, recursively call turn to handle the
        // next turn of the game. playerTurn is set to true because this
        // would be the end of the computer's turn
        turn(playerBoard, computerBoard, true, player, computer);
      }
    } catch (error) {
      console.log(error);
      // If the attack triggered an error, call turn again with playerTurn
      // set to false to prompt the computer to attack again
      turn(playerBoard, computerBoard, false, player, computer);
    }
  }
}

/**
 * Function primarily used to add an event listener to the start button on the
 * start screen so that the coordinates the player has specified for their ships
 * can be checked and, assuming no issues, the game can be started
 */
export function getShipCoords() {
  const startButton = document.querySelector(".start-game");
  // Div to hold error message if the player enters coordinates that cause
  // ships to overlap
  const errorMessageDiv = document.querySelector(".error-message");
  let listOfShipInputs = [];

  startButton.addEventListener("click", () => {
    // List to store the coordinates covered by each ship
    const coordList = [];
    // Track whether the player has entered coordinates that cause any
    // ships to overlap
    let overlapDetected = false;

    errorMessageDiv.style.display = "none";

    for (let ship in SHIP_LENGTHS) {
      const shipInputs = getShipInputs(ship);
      // Handle situation where the player hasn't specified coordinates
      // for all ships
      if (!shipInputs) {
        alert("Please enter row and column numbers for all ships");
        return;
      }

      try {
        // Calculate the list of coordinates that each ship covers based
        // on the length of the ship, its orientation, and the row and
        // column specified by the player
        const shipCoords = calculateCoords(
          ship,
          shipInputs["orientation"],
          shipInputs["row"],
          shipInputs["col"]
        );

        coordList.push(shipCoords);
        shipInputs["shipCoords"] = shipCoords;
        listOfShipInputs.push(shipInputs);
      } catch (error) {
        // Be sure to clear out the list of ship inputs; otherwise,
        // ships can be placed more than once
        listOfShipInputs = [];
        throw new Error(
          ship +
            " does not fit on board; please " +
            "specify appropriate cooridinates"
        );
      }
    }

    for (let i = 0; i < coordList.length - 1; i++) {
      if (checkShipOverlap(coordList[i], coordList[i + 1])) {
        overlapDetected = true;
        break;
      }
    }

    if (overlapDetected) {
      // Clear out list of ship inputs for same reason as above (so ships
      // don't end up getting placed more than once)
      listOfShipInputs = [];
      errorMessageDiv.textContent =
        "The coordinates you entered are invalid because they " +
        "would cause at least two of the ships to overlap on the " +
        "gameboard. Please enter valid coordinates.";
      errorMessageDiv.style.display = "block";
    } else {
      // If the player's inputs were valid, create and display the board
      // and start the game
      const boards = displayBoard(listOfShipInputs);
      const player = new RealPlayer(ROWS, COLS, boards["player"]);
      const computer = new ComputerPlayer(ROWS, COLS, boards["computer"]);

      placeComputerShips(computer);
      placePlayerShips(player, listOfShipInputs);
      // Decide who goes first; if 0, computer goes first, if 1, player does
      const goFirst = Math.floor(Math.random() * 2);
      if (goFirst === 0) {
        turn(boards["player"], boards["computer"], false, player, computer);
      } else {
        turn(boards["player"], boards["computer"], true, player, computer);
      }
    }
  });
}
