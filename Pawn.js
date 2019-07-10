class Pawn {
  constructor(row, col, isAI) {
    this.row = row;
    this.col = col;
    this.lastRow = null;
    this.lastCol = null;
    this.isAI = isAI;
    this.isSelected = false;
    this.badBoards = [];
  }


  move(dir) {
    this.lastRow = this.row;
    this.lastCol = this.col;
    this.row += this.isAI ? 1 : -1;
    this.col += dir;
    board.resetHighlight();
    board.update(this);
  }


  select() {
    if (!this.isAI) {
      board.resetHighlight();
      let allowedMoves = this.getAllowedMoves();
      for (let move of allowedMoves) {
        board.highlightCell(this.row - 1, this.col + move, this);
      }
    }
  }


  getAllowedMoves() {
    let allowedMoves = [];

    if (this.isAI) {

    } else {
      if (!board.cellIsOccupied(this.row - 1, this.col))
        allowedMoves.push(0);
      if (this.col > 0 && board.cellIsOccupied(this.row-1, this.col-1) && board.pawns[this.row-1][this.col-1].isAI)
        allowedMoves.push(-1);
      if (this.col < 2 && board.cellIsOccupied(this.row-1, this.col+1) && board.pawns[this.row-1][this.col+1].isAI)
        allowedMoves.push(1);
    }

    return allowedMoves;
  }


  isBadMove(dir) {
    id="";
    for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
		let pawn = board.pawns[row][col];
		if (pawn !== null) {
            id += pawn.row;
            id += pawn.col;
            id += pawn.isAI;
        } else {
			id += " ";
        }
    }
}
    
  }
}
