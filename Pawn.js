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

    if (!this.isAI) {
      isAITurn = true;
      document.dispatchEvent(playerTurnFinishedEvent);
    }
  }


  select() {
    if (!this.isAI && !isAITurn) {
      board.resetHighlight();
      let allowedMoves = this.getAllowedMoves();
      for (let move of allowedMoves) {
        board.highlightCell(this.row - 1, this.col + move, this);
      }
    }
  }


  AIMove() {
    let allowedMoves = this.getAllowedMoves();
    let AIMove = allowedMoves[Math.floor(Math.random() * allowedMoves.length)];
    this.move(AIMove);
  }


  getAllowedMoves() {
    let allowedMoves = [];

    if (this.isAI) {

      if (!board.cellIsOccupied(this.row + 1, this.col))
        allowedMoves.push(0);
      if (this.col > 0 && board.cellIsOccupied(this.row + 1, this.col - 1) && !board.pawns[this.row + 1][this.col - 1].isAI)
        allowedMoves.push(-1);
      if (this.col < 2 && board.cellIsOccupied(this.row + 1, this.col + 1) && !board.pawns[this.row + 1][this.col + 1].isAI)
        allowedMoves.push(1);
      allowedMoves.filter(move => !this.isBadMove(move));

    } else {

      if (!board.cellIsOccupied(this.row - 1, this.col))
        allowedMoves.push(0);
      if (this.col > 0 && board.cellIsOccupied(this.row - 1, this.col - 1) && board.pawns[this.row - 1][this.col - 1].isAI)
        allowedMoves.push(-1);
      if (this.col < 2 && board.cellIsOccupied(this.row - 1, this.col + 1) && board.pawns[this.row - 1][this.col + 1].isAI)
        allowedMoves.push(1);

    }

    return allowedMoves;
  }


  canMove() {
    return this.getAllowedMoves().length > 0;
  }


  isBadMove(dir) {
    return false;
  }
}