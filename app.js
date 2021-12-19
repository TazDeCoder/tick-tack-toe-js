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
////// App Architecture
///////////////////////////////////////////////

class App {
  // Game config
  #names = {};
  #markers = {};
  #isComputer;
  // Global variables
  #board = [];
  #currPlayer;
  #currMarker;
  #flag;

  constructor() {
    // Add event handlers
    btnReset.addEventListener("click", this._init.bind(this));
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
    if (this.#flag && clicked.classList.contains("item__btn")) {
      clicked.innerHTML = this.#currMarker;
      clicked.classList.add("board__btn--active");
      const [row, col] = [clicked.dataset.row, clicked.dataset.col];
      this.#board[row][col] = this.#currMarker;
      if (this._isGameWinner.call(this)) return;
      if (this.#isComputer)
        return setTimeout(this._computerTurn.bind(this), 400);
    }
  }

  _init() {
    // Reset game values
    this.#board = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];
    this.#currPlayer = this.#names.player1;
    this.#currMarker = this.#markers.player1;
    this.#flag = true;
    // Clean-up ui
    btnsBoard.forEach((btn) => {
      btn.textContent = "-";
      btn.classList.remove("board__btn--active");
    });
    this._updateGameLbl(`${this.#currPlayer}'s Turn`);
  }

  _loadGame() {
    this.#names.player1 = !inputPlayer1Name.value
      ? "Player 1"
      : inputPlayer1Name.value;
    this.#names.player2 = !inputPlayer2Name.value
      ? "Player 2"
      : inputPlayer2Name.value;
    this.#markers.player1 = inputPlayer1Marker.value;
    this.#markers.player2 = inputPlayer2Marker.value;
    this.#isComputer = inputComputer?.checked;
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    this._init();
  }

  /////////////////////////////////////
  //////////// Game logic

  _computerTurn() {
    let availableSpaces = [];
    const markPosition = function (btn) {
      if (
        [btn.dataset.row, btn.dataset.col].toString() === [row, col].toString()
      ) {
        btn.innerHTML = this.#currMarker;
        btn.classList.add("board__btn--active");
      }
    };

    const board = Object.values(this.#board);
    for (const [rowPos, row] of board.entries())
      row.map((col, colPos) =>
        col === "" ? availableSpaces.push([rowPos, colPos]) : null
      );
    const [row, col] =
      availableSpaces[Math.floor(Math.random() * availableSpaces.length)];
    btnsBoard.forEach(markPosition.bind(this));
    this.#board[row][col] = this.#currMarker;
    this._isGameWinner.bind(this);
  }

  _isGameWinner() {
    const board = Object.values(this.#board);
    const match = this._matchThreeInRow(board, this.#currMarker);
    const isFull = board.every((row) => row.every((el) => el));
    if (match || isFull) {
      const str = match ? `${this.#currPlayer} has Won!` : "It's a Tie 🤝!";
      this._updateGameLbl(str);
      this.#flag = false;
      return true;
    }
    // Update current marker
    this.#currMarker =
      this.#currMarker === this.#markers.player1
        ? this.#markers.player2
        : this.#markers.player1;
    // Update current player
    this.#currPlayer =
      this.#currPlayer === this.#names.player1
        ? this.#names.player2
        : this.#names.player1;
    this._updateGameLbl(`${this.#currPlayer}'s Turn`);
    return false;
  }

  _matchThreeInRow(board, marker) {
    let found;
    // Checking for horizontal 3-in-row
    for (const row of board) {
      if (found) break;
      found = row.every((el) => el === marker);
    }
    // Checking for vertical 3-in-row
    for (let z = 0; z < board.length; z++) {
      if (found) break;
      found = board.every((row) => row[z] === marker);
    }
    // Checking for diagonal 3-in-row
    for (let z = 0; z < board.length; z++) {
      if (found) break;
      found = board.every((row, idx) => row[idx] === marker);
    }
    for (let z = 0; z < board.length; z++) {
      if (found) break;
      found = board.every(
        (row, idx) => row[board.length - (idx + 1)] === marker
      );
    }

    return found;
  }
}

const app = new App();
