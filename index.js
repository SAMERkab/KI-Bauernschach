const ROWS_COUNT = 3;
const COLS_COUNT = 3;
const playerTurnFinishedEvent = new Event("playerTurnFinished");

let DOMTable = document.getElementById("board");
let playerPawnTemplate = document.getElementById("playerPawnTemplate");
let AIPawnTemplate = document.getElementById("AIPawnTemplate");
let pawnsObject, board, badBoards = [], isAITurn = false;

document.addEventListener("playerTurnFinished", () => {
  setTimeout(AIPlay, 500);
});
document.addEventListener("gameFinished", (e) => {
  setTimeout(() => {
    if (e.detail == 0) {
      alert("Die KI hat gewonnen.");
    } else {
      alert("Du hast gewonnen.");
    }
    playAgain();
  }, 100);
});

startGame();


function startGame() {
  pawnsObject = new PawnsObject({
    player: [
      [2, 0],
      [2, 1],
      [2, 2]
    ],
    AI: [
      [0, 0],
      [0, 1],
      [0, 2]
    ]
  });

  board = new Board(DOMTable, playerPawnTemplate, AIPawnTemplate);
}


function AIPlay() {
  let selectedPawn = pawnsObject.AIPawns[Math.floor(Math.random() * pawnsObject.AIPawns.length)];
  if (selectedPawn.canMove()) {
    for (let pawn of pawnsObject.AIPawns) {
      pawn.cantMove = false;
    }
    selectedPawn.AIMove();
    isAITurn = false;
  } else {
    selectedPawn.cantMove = true;
    if (pawnsObject.AIPawns.every(pawn => pawn.cantMove)) {
      document.dispatchEvent(new CustomEvent("gameFinished", { detail: 1 }));
    } else {
      AIPlay();
    }
  }
}


function playAgain() {
  isAITurn = false;
  for (let row = 0; row < ROWS_COUNT; row++) {
    for (let col = 0; col < COLS_COUNT; col++) {
      board.emptyCell(row, col);
    }
  }
  let newTable = DOMTable.cloneNode(true);
  DOMTable.parentNode.replaceChild(newTable, DOMTable);
  DOMTable = newTable;
  startGame();
}