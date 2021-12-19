"use strict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const board = document.querySelector(".container__item--board");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
// Buttons
const btnsBoard = document.querySelectorAll(".item__btn");
const btnReset = document.querySelector(".container__btn--reset");
const btnCloseModal = document.querySelector(".modal__btn--close");
// Inputs
const inputPlayer1Name = document.querySelector(".item__name--0");
const inputPlayer2Name = document.querySelector(".item__name--1");
const inputPlayer1Marker = document.querySelector(".item__marker--0");
const inputPlayer2Marker = document.querySelector(".item__marker--1");
const inputComputer = document.querySelector(".container__input--computer");
// Labels
const labelGame = document.querySelector(".container__label--display");

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
////// App Architecture
///////////////////////////////////////////////

class App {
  constructor() {
    // Add event handlers
    btnReset.addEventListener("click", this._init);
    btnCloseModal.addEventListener("click", this._loadGame.bind(this));
    overlay.addEventListener("click", this._loadGame.bind(this));
    board.addEventListener("click", this._handleClicks.bind(this));
  }

  /////////////////////////////////////
  //////////// Helper functions

  _updateGameLbl(txt) {
    labelGame.textContent = txt;
  }

  /////////////////////////////////////
  //////////// Handler functions

  _handleClicks(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (game.flag && clicked.classList.contains("item__btn")) {
      clicked.innerHTML = currMarker;
      clicked.classList.add("board__btn--active");
      const [row, col] = [clicked.dataset.row, clicked.dataset.col];
      game.updateBoard(row, col);
      if (this._isGameWinner.bind(this)) return;
      if (isComputer) return setTimeout(this._computerTurn.bind(this), 400);
    }
  }

  _init() {
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

  _loadGame() {
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
    this._init();
  }

  /////////////////////////////////////
  //////////// Game logic

  _computerTurn() {
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
    return this._isGameWinner.bind(this);
  }

  _findThreeInRow() {
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

  _isGameWinner() {
    const isWinner = this._findThreeInRow();
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
      currPlayer === game.names.player1
        ? game.names.player2
        : game.names.player1;
    updateGameLbl(`${currPlayer}'s Turn`);
    return false;
  }
}

const app = new App();
