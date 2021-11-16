"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Buttons
const btnsBoard = document.querySelectorAll(".board__btn");
const btnReset = document.querySelector(".game__btn--reset");
const btnCloseModal = document.querySelector(".btn--close-modal");
// Inputs
const inputPlayer1Name = document.querySelector(".player__name--0");
const inputPlayer2Name = document.querySelector(".player__name--1");
const inputPlayer1Marker = document.querySelector(".player__marker--0");
const inputPlayer2Marker = document.querySelector(".player__marker--1");
const inputComputer = document.querySelector(".modal__input--computer");
// Labels
const labelGame = document.querySelector(".game__label");
// Parents
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Global Variables
///////////////////////////////////////////////

let currMarker, currPlayer, isComputer;

const game = {
  flag: true,
  names: {
    player1: "",
    player2: "",
  },
  markers: {
    player1: "",
    player2: "",
  },
  board: [],
  updateBoard(row, col) {
    this.board[row][col] = currMarker;
  },
};

////////////////////////////////////////////////
////// Game UI Setup
///////////////////////////////////////////////

function init() {
  // Reset game values
  currPlayer = game.names.player1;
  currMarker = game.markers.player1;
  game.flag = true;
  game.board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  // Clean-up Ui
  btnsBoard.forEach((btn) => {
    btn.textContent = "-";
    btn.classList.remove("board__btn--active");
  });
  updateGameLbl(`${currPlayer}'s Turn`);
}

const updateGameLbl = (txt) => (labelGame.textContent = txt);

function loadGame() {
  game.names.player1 = !inputPlayer1Name.value
    ? "Player 1"
    : inputPlayer1Name.value;
  game.names.player2 = !inputPlayer2Name.value
    ? "Player 2"
    : inputPlayer2Name.value;
  game.markers.player1 = inputPlayer1Marker.value;
  game.markers.player2 = inputPlayer2Marker.value;
  isComputer = inputComputer.checked ? true : false;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  (() => init())();
}

////////////////////////////////////////////////
////// Game Logic
///////////////////////////////////////////////

function computerTurn() {
  let availableSpaces = [];
  const board = Object.values(game.board);
  for (const [rowPos, row] of board.entries())
    row.map((col, colPos) =>
      col === "" ? availableSpaces.push([rowPos, colPos]) : null
    );
  const [row, col] =
    availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
  btnsBoard.forEach(function (btn) {
    if (
      [btn.dataset.row, btn.dataset.col].toString() === [row, col].toString()
    ) {
      btn.innerHTML = currMarker;
      btn.classList.add("board__btn--active");
    }
  });
  game.updateBoard(row, col);
  return isGameWinner();
}

function findThreeInRow() {
  let found;
  const board = Object.values(game.board);
  // Checking for horizontal 3-in-row
  for (const row of board) {
    if (found) break;
    found = row.every((el) => el === currMarker);
  }
  // Checking for vertical 3-in-row
  for (let z = 0; z < board.length; z++) {
    if (found) break;
    found = board.every((row) => row[z] === currMarker);
  }
  // Checking for diagonal 3-in-row
  for (let z = 0; z < board.length; z++) {
    if (found) break;
    found = board.every((row, idx) => row[idx] === currMarker);
  }
  for (let z = 0; z < board.length; z++) {
    if (found) break;
    found = board.every(
      (row, idx) => row[board.length - (idx + 1)] === currMarker
    );
  }
  return found;
}

function isGameWinner() {
  const isWinner = findThreeInRow();
  const board = Object.values(game.board);
  const isFull = board.every((row) => row.every((el) => el));
  if (isWinner || isFull) {
    const str = isWinner ? `${currPlayer} has Won!` : "It's a Tie 🤝!";
    updateGameLbl(str);
    game.flag = false;
    return true;
  }
  currMarker =
    currMarker === game.markers.player1
      ? game.markers.player2
      : game.markers.player1;
  currPlayer =
    currPlayer === game.names.player1 ? game.names.player2 : game.names.player1;
  updateGameLbl(`${currPlayer}'s Turn`);
  return false;
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

btnsBoard.forEach((btn) =>
  btn.addEventListener("click", function () {
    if (game.flag && !btn.classList.contains("board__btn--active")) {
      btn.innerHTML = currMarker;
      btn.classList.add("board__btn--active");
      const [row, col] = [btn.dataset.row, btn.dataset.col];
      game.updateBoard(row, col);
      if (isGameWinner()) return;
      if (isComputer) return setTimeout(computerTurn, 400);
    }
  })
);

btnReset.addEventListener("click", init);
btnCloseModal.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);
