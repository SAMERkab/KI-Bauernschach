class PawnsObject {
  constructor(pawns) {
    this.allPawns = Array(ROWS_COUNT).fill(null).map(row => Array(COLS_COUNT).fill(null));
    this.playerPawns = [];
    this.AIPawns = [];

    if (pawns) {
      for (let rowAndCol of pawns.player) {
        let row = rowAndCol[0], col = rowAndCol[1];
        let pawn = new Pawn(row, col, false);
        this.allPawns[row][col] = pawn;
        this.playerPawns.push(pawn);
      }
      for (let rowAndCol of pawns.AI) {
        let row = rowAndCol[0], col = rowAndCol[1];
        let pawn = new Pawn(row, col, true);
        this.allPawns[row][col] = pawn;
        this.AIPawns.push(pawn);
      }
    }
  }


  getPawn(row, col) {
    return this.allPawns[row][col];
  }


  removePawn(row, col) {
    let pawnToRemove = this.allPawns[row][col];
    if (pawnToRemove.isAI) {
      this.AIPawns = this.AIPawns.filter(pawn => pawn !== pawnToRemove);
    } else {
      this.playerPawns = this.playerPawns.filter(pawn => pawn !== pawnToRemove);
    }
    this.allPawns[row][col] = null;
  }


  addPawn(pawn) {
    this.allPawns[pawn.row][pawn.col] = pawn;
    if (pawn.isAI) {
      if (!this.AIPawns.includes(pawn))
        this.AIPawns.push(pawn);
    } else {
      if (!this.playerPawns.includes(pawn))
        this.playerPawns.push(pawn);
    }
  }


  getSelectedPawn() {
    let pawn;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        pawn = this.getPawn(row, col);
        if (pawn && pawn.isSelected) {
          return pawn;
        }
      }
    }
    return null;
  }

}