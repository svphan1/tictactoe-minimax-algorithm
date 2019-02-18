var originalBoard;
const humanPlayer = "O";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
]

const cells = document.querySelectorAll(".cell");
startGame();

// Initialize new game

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  originalBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false);
  }
}

// Turn clicking on board

function turnClick(square) {
  if (typeof originalBoard[square.target.id] == "number") {
    turn(square.target.id, humanPlayer)
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  originalBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(originalBoard, player)
  if (gameWon) gameOver(gameWon)
}

// Check for winner

function checkWin(board, player) {
  let plays = board.reduce((a, ele, i) =>
    (ele === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
      if (win.every(elem => plays.indexOf(elem) > -1)) {
        gameWon = {index: index, player: player};
        break;
      }
    }
    return gameWon;
}

// check if game is won
function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor = gameWon.player === humanPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false)
  }
  declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lose")
}

// Change display to show winner

function declareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

// Empty squares

function emptySquares() {
  return originalBoard.filter(s => typeof s == "number");
}

// Ai available spots to play

function bestSpot() {
  return minimax(originalBoard, aiPlayer).index;
}

// Check if there is a tie

function checkTie() {
  if(emptySquares().length == 0) {
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!")
    return true;
  }
}

function minimax(originalBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, player)) {
    return {score: -10};
  } else if (checkWin(newBoard, aiPlayer)) {
    return {score: 20};
  } else if (availSpots.length === 0) {
    return {score: 0};
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }
  }
}





