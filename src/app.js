"use strict";

import "core-js/stable";

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
////// Board Factory Function
///////////////////////////////////////////////

const Board = function () {
  const _array = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  // Methods
  // Getter functions
  const getArray = function () {
    return this._array;
  };
  const getArrayFreeSpaces = function () {
    let freeSpaces = [];
    const arr = Object.values(this._array);
    for (const [rowPos, row] of arr.entries())
      row.map((col, colPos) =>
        col === "" ? freeSpaces.push([rowPos, colPos]) : null
      );
    return freeSpaces;
  };
  // Setter functions
  const setMarkerPosition = function (marker, pos) {
    const [row, col] = pos;
    this._array[row][col] = marker;
  };
  // Search for any three-in-a-row combinations
  const findThreeInRow = function (marker) {
    let found;
    const arr = Object.values(this._array);
    // Checking for horizontal 3-in-row
    for (const row of arr) {
      if (found) return found;
      found = row.every((el) => el === marker);
    }
    // Checking for vertical 3-in-row
    for (let z = 0; z < arr.length; z++) {
      if (found) return found;
      found = arr.every((row) => row[z] === marker);
    }
    // Checking for diagonal 3-in-row
    for (let z = 0; z < arr.length; z++) {
      if (found) return found;
      found = arr.every((row, idx) => row[idx] === marker);
    }
    for (let z = 0; z < arr.length; z++) {
      if (found) return found;
      found = arr.every((row, idx) => row[arr.length - (idx + 1)] === marker);
    }
    return false;
  };
  // Return whether array is full (not size)
  const isArrayFull = function () {
    const arr = Object.values(this._array);
    const isFull = arr.every((row) => row.every((el) => el));
    return isFull;
  };
  // Returning public values
  return {
    getArray,
    getArrayFreeSpaces,
    setMarkerPosition,
    findThreeInRow,
    isArrayFull,
    _array,
  };
};

////////////////////////////////////////////////
////// Game Configuration Object
///////////////////////////////////////////////

const game = {
  names: {},
  markers: {},
  config: {
    modeCPU: false,
  },
};

////////////////////////////////////////////////
////// App Class Architecture
///////////////////////////////////////////////

class App {
  #board;
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
    const btn = e.target.closest(".item__btn");
    if (!this.#flag || !btn || btn.classList.contains("btn--active")) return;
    btn.innerHTML = this.#currMarker;
    btn.classList.add("btn--active");
    const [row, col] = [btn.dataset.row, btn.dataset.col];
    this.#board.setMarkerPosition(this.#currMarker, [row, col]);
    if (this._isGameWinner.call(this)) return;
    if (game.config.modeCPU)
      return setTimeout(this._computerTurn.bind(this), 400);
  }

  _init() {
    // Reset game values
    this.#board = Board();
    this.#currPlayer = game.names.player1;
    this.#currMarker = game.markers.player1;
    this.#flag = true;
    // Clean-up ui
    btnsBoard.forEach((btn) => {
      btn.textContent = "";
      btn.classList.remove("btn--active");
    });
    this._updateGameLbl(`${this.#currPlayer}'s Turn`);
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
    game.config.modeCPU = inputComputer?.checked;
    Object.freeze(game);
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    this._init();
  }

  /////////////////////////////////////
  //////////// Game logic

  _computerTurn() {
    const markPosition = function (btn) {
      if (
        [btn.dataset.row, btn.dataset.col].toString() === [row, col].toString()
      ) {
        btn.innerHTML = this.#currMarker;
        btn.classList.add("btn--active");
      }
    };
    // Select random available space on board
    const freeSpaces = this.#board.getArrayFreeSpaces();
    const [row, col] =
      freeSpaces[Math.floor(Math.random() * freeSpaces.length)];
    // Mark position on board
    btnsBoard.forEach(markPosition.bind(this));
    this.#board.setMarkerPosition(this.#currMarker, [row, col]);
    // Check if there is a winner
    this._isGameWinner.call(this);
  }

  _isGameWinner() {
    // Checking for three-in-a-row
    const match = this.#board.findThreeInRow(this.#currMarker);
    // Condition for a draw/tie
    if (match || this.#board.isArrayFull()) {
      const str = match ? `${this.#currPlayer} has Won!` : "It's a Tie 🤝!";
      this._updateGameLbl(str);
      this.#flag = false;
      return true;
    }
    // Update current marker
    this.#currMarker =
      this.#currMarker === game.markers.player1
        ? game.markers.player2
        : game.markers.player1;
    // Update current player
    this.#currPlayer =
      this.#currPlayer === game.names.player1
        ? game.names.player2
        : game.names.player1;
    // Display current player turn
    this._updateGameLbl(`${this.#currPlayer}'s Turn`);
    return false;
  }
}

const app = new App();
