"use strict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Buttons
const btnsBoard = document.querySelectorAll(".board__btn");
const btnReset = document.querySelector(".game__btn--reset");
// Labels
const labelGame = document.querySelector(".game__label");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let currMarker;

const game = {
  flag: true,
  board: [],
  updateBoard(row, col) {
    this.board[row][col] = currMarker;
  },
};

(() => init())();

function init() {
  // Reset game values
  currMarker = "X";
  game.flag = true;
  game.board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  // Clean-up Ui
  btnsBoard.forEach((btn) => {
    btn.textContent = "";
    btn.classList.remove("board__btn--active");
  });
  labelGame.textContent = `Current marker is: ${currMarker}`;
}

////////////////////////////////////////////////
////// Game logic
///////////////////////////////////////////////

function isGameWinner() {
  let isWinner;
  const board = Object.values(game.board);
  // Checking for horizontal 3-in-row
  for (const row of board) {
    if (isWinner) break;
    isWinner = row.every((el) => el === currMarker);
  }
  // Checking for vertical 3-in-row
  for (let z = 0; z < board.length; z++) {
    if (isWinner) break;
    isWinner = board.every((row) => row[z] === currMarker);
  }
  // Checking for diagonal 3-in-row
  for (let z = 0; z < board.length; z++) {
    if (isWinner) break;
    isWinner = board.every((row, idx) => row[idx] === currMarker);
    if (isWinner) break;
    isWinner = board.every(
      (row, idx) => row[board.length - (idx + 1)] === currMarker
    );
  }
  if (isWinner) {
    game.flag = false;
    labelGame.textContent = `Marker ${currMarker} has Won!`;
    return;
  }
  // Checking if board is full therefore a tie
  const isFull = board.every((row) => row.every((el) => el));
  if (isFull) {
    game.flag = false;
    labelGame.textContent = "It's a Tie";
    return;
  }
  currMarker = currMarker === "X" ? "O" : "X";
  labelGame.textContent = `Current marker is: ${currMarker}`;
}

////////////////////////////////////////////////
////// Event handlers
///////////////////////////////////////////////

btnsBoard.forEach((btn) =>
  btn.addEventListener("click", function () {
    if (game.flag && !btn.classList.contains("board__btn--active")) {
      btn.innerHTML = currMarker;
      btn.classList.add("board__btn--active");
      const [row, col] = [btn.dataset.row, btn.dataset.col];
      game.updateBoard(row, col);
      isGameWinner();
    }
  })
);

btnReset.addEventListener("click", init);
