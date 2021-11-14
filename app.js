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
  winConditions: {
    xRow: new Array(3).fill("X"),
    oRow: new Array(3).fill("O"),
  },
};

(() => init())();

function init() {
  // Reset game values
  currMarker = "X";
  game.flag = true;
  game.board = [
    new Array(3).fill(""),
    new Array(3).fill(""),
    new Array(3).fill(""),
  ];
  // Clean-up Ui
  btnsBoard.forEach((btn) => {
    btn.textContent = "";
    btn.classList.remove("board__btn--active");
  });
  labelGame.textContent = "";
}

////////////////////////////////////////////////
////// Game logic
///////////////////////////////////////////////

function checkWinner() {
  let isWinner;
  const [xRow, oRow] = Object.values(game.winConditions);
  const board = Object.values(game.board);
  if (currMarker === "X") {
    isWinner = board.some((row) => row.toString() === xRow.toString());
  } else {
    isWinner = board.some((row) => row.toString() === oRow.toString());
  }
  if (isWinner) {
    game.flag = false;
    labelGame.textContent = `Marker ${currMarker} has Won!`;
    return;
  }
  const isFull = board.every((row) => row.every((el) => el));
  if (isFull) {
    game.flag = false;
    labelGame.textContent = "It's a Tie";
    return;
  }
  currMarker = currMarker === "X" ? "O" : "X";
}

////////////////////////////////////////////////
////// Event handlers
///////////////////////////////////////////////

btnsBoard.forEach((btn) =>
  btn.addEventListener("click", function () {
    if (game.flag && !btn.classList.contains("board__btn--active")) {
      const [row, col] = [btn.dataset.row, btn.dataset.col];
      game.updateBoard(row, col);
      btn.innerHTML = currMarker;
      btn.classList.add("board__btn--active");
      return checkWinner();
    }
  })
);

btnReset.addEventListener("click", init);
