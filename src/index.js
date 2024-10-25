import "./styles.css";
import { getShipCoords } from "./dom.js";

console.log("Up and running");
// This adds an event listener to the start button which collects the player's
// specified ship coordinates/orientations, analyzes them for any issues (like)
// overlap, and if there are none, starts the game
getShipCoords();
