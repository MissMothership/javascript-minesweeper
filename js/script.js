"use strict";
window.addEventListener("load", function () {
    start();
    console.log("start");
});


//  CREATE GAME
let startGame = document.querySelector("#start_btn");

startGame.addEventListener('click', function () {
    // Starts a new Game
    start();
    // removing the WinnerBanner if it was won before.
    newGame();
});

function start() {
    //  Input Values
    let height = document.querySelector("#height_grid").value;
    let width = document.querySelector("#width_grid").value;

    gameField = [];
    createGameField(height, width);
}

// TODO
// set default
class Box {
    constructor(row, col) {
        this.row = row;
        this.col = col;
    }
    getOpened() {
        return this.opened;
    }
    setOpened() {
        this.opened = true;
    }
    getFlagged() {
        return this.flagged;
    }
    setFlagged(flagged) {
        this.flagged = flagged;
    }
    getMined() {
        return this.mined;
    }
    setMined() {
        this.mined = true;
    }

    setMineCount() {
        this.mineCount++;
    }
    opened = false;
    flagged = false;
    mined = false;
    mineCount = 0;
}

let gameField = [];

function createGameField(height, width) {
    //  for each row and for each column pushing new Box to the gameField Array
    for (let i = 0; i < height; i++) {
        let row = [];
        for (let j = 0; j < width; j++) {
            row.push(new Box(i, j));
        }
        gameField.push(row);
    }
    console.log(gameField);

    // get the grid and setting the height and width
    let gridContent = document.querySelector("#grid_content");
    /**
     * calculate the size of the Boxes plus the border inclusive 
     * the padding.
     */
    let gridHeight = height * 25 + 2;
    let gridWidth = width * 25 + 2;
    gridContent.style.width = gridWidth + "px";
    gridContent.style.height = gridHeight + "px";

    let gridBorder = document.querySelector("#grid_border");
    // clearing gridBorder before adding child elements
    gridBorder.innerHTML = "";

    /**
     *  creating new rows and columns 
     *  create boxes
     *  set attributes to each box.
     *  add the boxes to the rows
     */
    for (let c = 0; c < gameField.length; c++) {
        let row = document.createElement("div");
        row.classList.add("grid_row");
        gridBorder.appendChild(row);

        for (let c2 = 0; c2 < gameField[c].length; c2++) {
            let box = document.createElement("div");
            box.classList.add("box");

            box.setAttribute("row", c);
            box.setAttribute("col", c2);
            box.setAttribute("opened", gameField[c][c2].getOpened());
            box.setAttribute("flagged", gameField[c][c2].getFlagged());
            box.setAttribute("mined", gameField[c][c2].getMined());
            box.setAttribute("mineCount", 0);
            box.setAttribute("onmouseup", "openBoxCell(" + c + "," + c2 + ")");
            box.setAttribute("oncontextmenu", "return false;");

            row.appendChild(box);
        }
    }

    RandomlyMines(gameField, height, width);
    calculateNeighborMineCount();
}

/**
 *  function to randomly place the mines
 *  if a mine placed on an already mined box then generate new coordinates 
 *  until the selected box isnt mined before
 * 
 */
function RandomlyMines(gameField, height, width) {

    let bombs = document.querySelector("#bombs_grid").value;

    let p = document.querySelector("#bombs_counter p");
    p.innerText = bombs;

    let mineCoordinates = [];

    for (let i = 0; i < bombs; i++) {
        let randomRowPosition = Math.floor(Math.random() * height) + 0;
        let randomColPosition = Math.floor(Math.random() * width) + 0;

        let newMinePosition = randomRowPosition + "," + randomColPosition;

        while (mineCoordinates.includes(newMinePosition)) {
            randomRowPosition = Math.floor(Math.random() * height) + 0;
            randomColPosition = Math.floor(Math.random() * width) + 0;

            newMinePosition = randomRowPosition + "," + randomColPosition;
        }

        mineCoordinates.push(newMinePosition);

        updateMineState(randomRowPosition, randomColPosition, gameField);
    }
}

// checking the row and col position with the mined box coordinations and setting the attribute "mined" as true
function updateMineState(row, col, gameField) {
    gameField[row][col].setMined();
    let boxes = document.querySelectorAll(".box");
    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].getAttribute("row") == row && boxes[i].getAttribute("col") == col) {
            boxes[i].setAttribute("mined", true);
        }
    }

}

/** 
 * looping trough rows and columns and check if this box is mined or not.
 * if this box isnt mined calling the getNeighbors function and passing the row and the col number.
 */
function calculateNeighborMineCount() {
    let box = document.querySelectorAll(".box");
    for (let i = 0; i < box.length; i++) {
        let val = box[i].getAttribute("mined");
        if (val != "true") {
            let row = box[i].getAttribute("row");
            let col = box[i].getAttribute("col");
            getNeighbors(row, col, box);
        }
    }
}

/** 
 * Checking if the surrounding boxes are mined.
 * declaring a counter for the box and counting it up if a box surrounding is mined.
 */

/**
 * if box is not mined then take this row -1 and run through it
 * if row -1 (+) Col -1 && Col = Col && Col +1 then check whether these fields are mined
 * if so, then mineCount () +1 for this field for each surrounding bomb
 *
 * when row -1 is complete then take that row and iterate through it
 * if row (+) Col -1 && Col +1 then check whether these fields are mined
 * if so, then mineCount () +1 for this field for each surrounding bomb
 *
 * when row is complete then take row +1 and run through it
 * if row +1 (+) Col -1 && Col = Col && Col +1 then check whether these fields are mined
 * if so, then mineCount () +1 for this field for each surrounding bomb
 */
function getNeighbors(row, col, box) {

    let tRow = parseInt(row) - 1;
    let bRow = parseInt(row) + 1;

    let lCol = parseInt(col) - 1;
    let rCol = parseInt(col) + 1;

    let counter = 0;
    for (let i = 0; i < box.length; i++) {
        if (box[i].getAttribute("row") == row && box[i].getAttribute("col") == col) {
            let notMinedBox = box[i];
            for (let j = 0; j < box.length; j++) {
                if (box[j].getAttribute("row") == tRow) {
                    if (box[j].getAttribute("col") == lCol || box[j].getAttribute("col") == col || box[j].getAttribute("col") == rCol) {
                        if (box[j].getAttribute("mined") == "true") {
                            counter = counter + 1;
                            gameField[row][col].setMineCount();
                        }
                    }

                }

                if (box[j].getAttribute("row") == row) {
                    if (box[j].getAttribute("col") == lCol || box[j].getAttribute("col") == rCol) {
                        if (box[j].getAttribute("mined") == "true") {
                            counter = counter + 1;
                            gameField[row][col].setMineCount();
                        }
                    }

                }

                if (box[j].getAttribute("row") == bRow) {
                    if (box[j].getAttribute("col") == lCol || box[j].getAttribute("col") == col || box[j].getAttribute("col") == rCol) {
                        if (box[j].getAttribute("mined") == "true") {
                            counter = counter + 1;
                            gameField[row][col].setMineCount();
                        }
                    }

                }
            }
            notMinedBox.setAttribute("minecount", counter);
        }
    }
}



//  PLAY GAME

/** 
 * Clicking with the left mouse key will open the box and shows if its mined or not. This sets the attribute "opened" to true
 * Clicking with the right mouse key will set a Flag if the box hasn´t been opened before,
 * which can be removed by clicking the right mouse key again. This sets the attribute "flagged" to true if its flagged and to false if the flag will be removed
 * 
 * Counting the remaining bombs -1 if a box has been flagged and +1 if a flag has been removed
 */

function openBoxCell(row, col) {
    let boxes = document.querySelectorAll(".box");

    let p = document.querySelector("#bombs_counter p");
    let remainingBombs = p.innerText;


    for (let i = 0; i < boxes.length; i++) {
        if (boxes[i].getAttribute("row") == row && boxes[i].getAttribute("col") == col) {
            if (event.which == 1) {
                let box = boxes[i];
                showMineCount(box, row, col, boxes);


            }
            else if (event.which == 2) {
                //Nothing happens
            }
            else if (event.which == 3) {
                //FLAG
                if (boxes[i].getAttribute("opened") == "false") {
                    if (boxes[i].getAttribute("flagged") == "false") {
                        if (remainingBombs > 0) {
                            remainingBombs--;
                        }

                        boxes[i].classList.add("teemo_flag");
                        boxes[i].setAttribute("flagged", "true");
                    } else {
                        remainingBombs++;
                        boxes[i].classList.remove("teemo_flag");
                        boxes[i].setAttribute("flagged", "false");
                    }
                    p.innerText = remainingBombs;
                }
            }
        }
    }
};

/**
 * if the clicked box is Flagged you cant open it with the left mouse key
 * if the clicked box isn´t Flagged the attribute "opened" will be setted to true and adding the class opened to the box
 * 
 * if the clicked box is mined all bombs will be shown and the game is over.
 * removing the attribute "onmouseup" on all boxes.
 * 
 * if the box isnt mined then get the minecount attribute value and add a class to the box and display the minecount.
 * 
 */
function showMineCount(box, row, col, boxes) {
    if (box.getAttribute("flagged") == "false") {
        box.setAttribute("opened", "true");
        box.classList.add("opened");
        //  Game Over
        if (box.getAttribute("mined") == "true") {
            for (let j = 0; j < boxes.length; j++) {
                if (boxes[j].getAttribute("mined") == "true") {
                    boxes[j].classList.add("open_bombs");
                } else {
                    if (boxes[j].getAttribute("flagged") == "true") {
                        boxes[j].classList.add("wrong_bomb");
                    }
                }
                boxes[j].removeAttribute("onmouseup");
            }
        }
        else if (box.getAttribute("minecount") == 1) {
            box.classList.add("count_one");
            box.innerText = "1";
        }
        else if (box.getAttribute("minecount") == 2) {
            box.classList.add("count_two");
            box.innerText = "2";
        }
        else if (box.getAttribute("minecount") == 3) {
            box.classList.add("count_three");
            box.innerText = "3";
        }
        else if (box.getAttribute("minecount") == 4) {
            box.classList.add("count_four");
            box.innerText = "4";
        }
        else if (box.getAttribute("minecount") == 5) {
            box.classList.add("count_five");
            box.innerText = "5";
        }
        else if (box.getAttribute("minecount") == 6) {
            box.classList.add("count_six");
            box.innerText = "6";
        }
        else if (box.getAttribute("minecount") == 7) {
            box.classList.add("count_seven");
            box.innerText = "7";
        }
        else if (box.getAttribute("minecount") == 8) {
            box.classList.add("count_eight");
            box.innerText = "8";
        }
        else if (box.getAttribute("minecount") == 0) {
            openNeighbors();
        }

        checkFinished();
    }
}

// if a box without a mine or a minecount was opened, filter all boxes which also dont have a minecount and open all boxes around it.

function openNeighbors() {
    let boxes = Array.from(document.querySelectorAll(".box"));

    let openBoxes = boxes.filter(box => box.getAttribute("opened") == "true" && box.getAttribute("finished") != "true" && box.getAttribute("minecount") == 0)
    if (openBoxes.length > 0) {
        console.log(openBoxes);

        openBoxes.forEach(openBox => {
            openBox.setAttribute("finished", "true");
            let tRow = parseInt(openBox.getAttribute("row")) - 1;
            let bRow = parseInt(openBox.getAttribute("row")) + 1;

            let lCol = parseInt(openBox.getAttribute("col")) - 1;
            let rCol = parseInt(openBox.getAttribute("col")) + 1;

            boxes.forEach(box => {
                if (box.getAttribute("row") == tRow || box.getAttribute("row") == openBox.getAttribute("row") || box.getAttribute("row") == bRow) {
                    if (box.getAttribute("col") == lCol || box.getAttribute("col") == openBox.getAttribute("col") || box.getAttribute("col") == rCol) {
                        if (box.getAttribute("mined") == "false") {
                            box.setAttribute("opened", "true");
                            box.classList.add("opened");
                            showMineCount(box);
                            openNeighbors();
                        }
                    }
                }
            })
        })
    }
    checkFinished();
}

// checking if all boxes which are not mined but opened. If this is the case you won, if not the game continue
function checkFinished() {
    let box = document.querySelectorAll(".box");

    let won = false;
    for (let c = 0; c < box.length; c++) {
        if (box[c].getAttribute("mined") == "false") {
            if (box[c].getAttribute("opened") == "false") {
                won = false;
                return false;
            }
            else {
                //You won the game
                won = true;

            }
        }
    }
    if (won == true) {
        winner();
    }
}

// Shows a banner that you won the game.
function winner() {


    let winnerBanner = document.querySelector("#winner_banner");

    let winnerBox = document.querySelector(".winner_box");
    winnerBox.classList.add("d-flex");

    let opacity = 0;
    let intervalID = setInterval(function () {

        if (opacity < 1) {
            opacity = opacity + 0.1
            winnerBanner.style.opacity = opacity;
        } else {
            clearInterval(intervalID);
        }
    }, 200);



}


// if you won before, the winner banner will be removed when starting a new game
function newGame() {
    let winnerBanner = document.querySelector("#winner_banner");

    let winnerBox = document.querySelector(".winner_box");
    winnerBox.classList.remove("d-flex");

    let opacity = 1;
    let intervalID = setInterval(function () {

        if (opacity > 0) {
            opacity = opacity - 0.1
            winnerBanner.style.opacity = opacity;
        } else {
            clearInterval(intervalID);
        }
    }, 200);
}