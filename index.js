const ROWS_COUNT = 3;
const COLS_COUNT = 3;
const playerTurnFinishedEvent = new Event("playerTurnFinished");

let DOMTable = document.getElementById("board");
let playerPawnTemplate = document.getElementById("playerPawnTemplate");
let AIPawnTemplate = document.getElementById("AIPawnTemplate");
let pawnsObject, board, badBoards, isAITurn = false;

document.addEventListener("playerTurnFinished", () => {
  setTimeout(AIPlay, 250);
});
document.addEventListener("gameFinished", (e) => {
  setTimeout(() => {
    if (e.detail == "AI") {
      alert("Die KI hat gewonnen.");
    } else {
      alert("Du hast gewonnen.");
    }
    playAgain();
  }, 100);
});

startGame();


function startGame() {
  badBoards = JSON.parse( localStorage.getItem("badBoards") ) || [];
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
  let allowedMoves = selectedPawn.select();

  if (allowedMoves.length > 0) {

    setTimeout(() => {
      for (let pawn of pawnsObject.AIPawns) {
        pawn.cantMove = false;
      }
      let randomMove = allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
      selectedPawn.move(randomMove);
      isAITurn = false;
      checkGameFinished();
    }, 500);

  } else {
    selectedPawn.cantMove = true;
    if (pawnsObject.AIPawns.every(pawn => pawn.cantMove)) {
      endGame("player");
    } else {
      AIPlay();
    }
  }

}


function checkGameFinished() {
  if (pawnsObject.AIPawns.length == 0) {
    endGame("player");
  } else if (pawnsObject.playerPawns.length == 0) {
    endGame("AI");
  } else if (!pawnsObject.playerPawns.some(pawn => pawn.canMove())) {
    endGame("AI");
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


function endGame(winner) {
  if (winner == "player") {
    badBoards.push(pawnsObject.generateIdForPawns(pawnsObject.lastAllPawns));
    localStorage.setItem( "badBoards", JSON.stringify(badBoards) );
  }
  document.dispatchEvent(new CustomEvent("gameFinished", { detail: winner }));
}