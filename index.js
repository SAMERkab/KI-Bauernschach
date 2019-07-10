const playerTurnFinishedEvent = new Event("playerTurnFinished");
let DOMTable = document.getElementById("board");
let playerPawnTemplate = document.getElementById("playerPawnTemplate");
let AIPawnTemplate = document.getElementById("AIPawnTemplate");
let isAITurn = false;
let pawns = [], AIPawns = [];

for (let i = 0; i < 3; i++) {
  pawns.push(Array(3).fill(null));
}
pawns[2][0] = new Pawn(2, 0, false);
pawns[2][1] = new Pawn(2, 1, false);
pawns[2][2] = new Pawn(2, 2, false);
pawns[0][0] = new Pawn(0, 0, true);
pawns[0][1] = new Pawn(0, 1, true);
pawns[0][2] = new Pawn(0, 2, true);

let board = new Board(DOMTable, pawns, playerPawnTemplate, AIPawnTemplate);

for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (pawns[row][col] && pawns[row][col].isAI) {
      AIPawns.push(pawns[row][col]);
    }
  }
}

document.addEventListener("playerTurnFinished", () => {
  AIPlay();
});


function AIPlay() {
  let selectedPawn = AIPawns[Math.floor(Math.random() * AIPawns.length)];
  if (selectedPawn.canMove()) {
    selectedPawn.AIMove();
    isAITurn = false;
  } else {
    AIPawns.splice(AIPawns.indexOf(selectedPawn), 1);
    if (AIPawns.length == 0) {
      alert("Game finished");
    } else {
      AIPlay();
    }
  }
}