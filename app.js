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
// Labels
const labelGame = document.querySelector(".game__label");
// Parents
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Global Variables
///////////////////////////////////////////////

let currMarker, currPlayer, player1, player2;

const game = {
  flag: true,
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
  currPlayer = player1;
  updateGameLbl(`${currPlayer}'s Turn`);
}

const updateGameLbl = (txt) => (labelGame.textContent = txt);

function loadGame() {
  player1 = !inputPlayer1Name.value ? "Player 1" : inputPlayer1Name.value;
  player2 = !inputPlayer2Name.value ? "Player 2" : inputPlayer2Name.value;
  game.markers.player1 = inputPlayer1Marker.value;
  game.markers.player2 = inputPlayer2Marker.value;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  (() => init())();
}

////////////////////////////////////////////////
////// Game Logic
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
    updateGameLbl(`${currPlayer} has Won!`);
    return;
  }
  // Checking if board is full therefore a tie
  const isFull = board.every((row) => row.every((el) => el));
  if (isFull) {
    game.flag = false;
    updateGameLbl("It's a Tie");
    return;
  }
  currMarker =
    currMarker === game.markers.player1
      ? game.markers.player2
      : game.markers.player1;
  currPlayer = currPlayer === player1 ? player2 : player1;
  updateGameLbl(`${currPlayer}'s Turn`);
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
      isGameWinner();
    }
  })
);

btnReset.addEventListener("click", init);

btnCloseModal.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);
