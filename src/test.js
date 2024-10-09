const Ship = require("./ship");
const Gameboard = require("./gameboard");

function shipTests() {
    test("ship of 0 length already sunk", () => {
        const testShip = new Ship(0);
        expect(testShip.isSunk()).toBe(true);
    });

    test("ship of nonzero length that has not been hit isn't sunk", () => {
        const testShip = new Ship(3);
        expect(testShip.isSunk()).toBe(false);
    });

    test("ship of nonzero length that has been hit 'length' number of times is sunk",
        () => {
            const testShip = new Ship(3);
            testShip.hit();
            testShip.hit();
            testShip.hit();
            expect(testShip.isSunk()).toBe(true);
        }
    );

    test("creating ship with negative length produces error", () => {
        expect(() => new Ship(-5)).toThrow("Ship length cannot be negative");
    });

    test("creating ship with non-number length produces error", () => {
        expect(() => new Ship("test")).toThrow("Ship length must be an integer");
    });

    test("creating ship with floating point length produces error", () => {
        expect(() => new Ship(3.14)).toThrow("Ship length must be an integer");
    });
}

function boardTests() {
    test("inserting ship horizontally within gameboard bounds is successful", 
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(testBoard.placeShip(1, 1, 3, "horizontal")).toBe(true);
    });

    test("inserting ship vertically within gameboard bounds is successful", 
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(testBoard.placeShip(1, 1, 3, "vertical")).toBe(true);
    });

    test("inserting ship horizontally with negative coordinates throws an error", 
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.placeShip(-3, -3, 3, "horizontal"))
              .toThrow("Coordinates out of bounds. Please enter valid " +
                "coordinates");
    });

    test("inserting ship vertically with out of bounds coordinates throws an error", 
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.placeShip(6, 6, 3, "vertical"))
              .toThrow("Coordinates out of bounds. Please enter valid " +
                "coordinates");
    });

    test("inserting ship horizontally on top of another ship throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            testBoard.placeShip(1, 1, 3, "horizontal");
            expect(() => testBoard.placeShip(1, 2, 3, "horizontal"))
               .toThrow("Cannot place ship here because it overlaps with " +
                 "another ship");
            
        }
    );

    test("inserting ship vertically on top of another ship throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            testBoard.placeShip(1, 1, 3, "horizontal");
            expect(() => testBoard.placeShip(1, 1, 3, "vertical"))
               .toThrow("Cannot place ship here because it overlaps with " +
                 "another ship");
        }
    );

    test("inserting ship that is too long horizontally throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.placeShip(1, 1, 9, "horizontal"))
                .toThrow("Ship is too long. Please enter a valid ship length");
        }
    );

    test("inserting ship that is too long vertically throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.placeShip(1, 1, 9, "vertical"))
                .toThrow("Ship is too long. Please enter a valid ship length");
        }
    );

    test("failure to specify 'horizontal' or 'vertical' throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.placeShip(1, 1, 3, ""))
                .toThrow("Please specify either 'horizontal' or 'vertical' " +
                "for the orientation of the ship");
        }
    );

    test("specifying negative values for attack space throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.receiveAttack(-2, -2))
                .toThrow("Coordinates out of bounds. Please enter valid " +
                "coordinates");
        }
    );

    test("specifying out-of-bounds values for attack space throws an error",
        () => {
            const testBoard = new Gameboard(5, 5);
            expect(() => testBoard.receiveAttack(8, 3))
                .toThrow("Coordinates out of bounds. Please enter valid " +
                "coordinates");
        }
    );

    test("attacking space without a ship returns false",
        () => {
            const testBoard = new Gameboard(10, 7);
            expect(testBoard.receiveAttack(3, 3)).toBe(false);
        }
    );

    test("attacking space with a ship returns true",
        () => {
            const testBoard = new Gameboard(25, 25);
            testBoard.placeShip(3, 3, 3, "horizontal");
            expect(testBoard.receiveAttack(3, 3)).toBe(true);
        }
    );

    test("shipsSunk returns false if no ships have been placed",
        () => {
            const testBoard = new Gameboard(1, 1);
            expect(testBoard.shipsSunk()).toBe(false);
        }
    );

    test("shipsSunk returns false if not all ships have been sunk",
        () => {
            const testBoard = new Gameboard(13, 10);
            testBoard.placeShip(1, 2, 4, "horizontal");
            testBoard.placeShip(8, 9, 2, "vertical");
            testBoard.receiveAttack(1, 2);
            testBoard.receiveAttack(1, 3);
            testBoard.receiveAttack(1, 4);
            expect(testBoard.shipsSunk()).toBe(false);
        }
    );

    test("shipsSunk returns true if  all ships have been sunk",
        () => {
            const testBoard = new Gameboard(13, 10);
            testBoard.placeShip(1, 2, 4, "horizontal");
            testBoard.placeShip(8, 9, 2, "vertical");
            testBoard.receiveAttack(1, 2);
            testBoard.receiveAttack(1, 3);
            testBoard.receiveAttack(1, 4);
            testBoard.receiveAttack(1, 5);
            testBoard.receiveAttack(8, 9);
            testBoard.receiveAttack(9, 9);
            expect(testBoard.shipsSunk()).toBe(true);
        }
    );

    test("receiveAttack accurately records a miss",
        () => {
            const testBoard = new Gameboard(100, 100);
            testBoard.receiveAttack(69, 69);
            expect(testBoard.showMisses()[0]).toStrictEqual([69, 69]);
        }
    );

    test("receiveAttack accurately records multiple misses but misses array " +
        "does not include hits",
        () => {
            const testBoard = new Gameboard(1000, 1000);
            testBoard.placeShip(43, 62, 10, "horizontal");
            testBoard.receiveAttack(900, 900);
            testBoard.receiveAttack(43, 62);
            testBoard.receiveAttack(13, 69);
            expect(testBoard.showMisses()).toStrictEqual([[900, 900], [13, 69]]);
        }
    );
}

shipTests();
boardTests();