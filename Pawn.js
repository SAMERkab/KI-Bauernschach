class Pawn {
  constructor(row, col, isAI) {
    this.row = row;
    this.col = col;
    this.lastRow = null;
    this.lastCol = null;
    this.isAI = isAI;
    this.isSelected = false;
  }


  move(dir) {
    this.lastRow = this.row;
    this.lastCol = this.col;
    this.row += this.isAI ? 1 : -1;
    this.col += dir;
    board.resetHighlight();
    board.update(this);

    if (this.isAI) {
      if (this.row === ROWS_COUNT - 1) {
        endGame("AI");
      }
    } else {
      if (this.row == 0) {
        endGame("player");
      } else {
        isAITurn = true;
        document.dispatchEvent(playerTurnFinishedEvent);
      }
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
    let allowedMoves = [], leftPawn, rightPawn;

    if (this.isAI) {

      leftPawn = pawnsObject.getPawn(this.row + 1, this.col - 1);
      rightPawn = pawnsObject.getPawn(this.row + 1, this.col + 1);
      if (!pawnsObject.getPawn(this.row + 1, this.col))
        allowedMoves.push(0);
      if (this.col > 0 && leftPawn && !leftPawn.isAI)
        allowedMoves.push(-1);
      if (this.col < 2 && rightPawn && !rightPawn.isAI)
        allowedMoves.push(1);
      allowedMoves = allowedMoves.filter(move => !this.isBadMove(move));

    } else {

      leftPawn = pawnsObject.getPawn(this.row - 1, this.col - 1);
      rightPawn = pawnsObject.getPawn(this.row - 1, this.col + 1);
      if (!pawnsObject.getPawn(this.row - 1, this.col))
        allowedMoves.push(0);
      if (this.col > 0 && leftPawn && leftPawn.isAI)
        allowedMoves.push(-1);
      if (this.col < 2 && rightPawn && rightPawn.isAI)
        allowedMoves.push(1);

    }

    return allowedMoves;
  }


  canMove() {
    return this.getAllowedMoves().length > 0;
  }


  isBadMove(dir) {
    let newBoard = this.evalMove(dir);
    let id = pawnsObject.generateIdForPawns(newBoard);
    return badBoards.includes(id);
  }


  evalMove(dir) {
    let allPawns = JSON.parse(JSON.stringify(pawnsObject.allPawns));
    let newRow = this.row + 1, newCol = this.col + dir;
    let newPawn = new Pawn(newRow, newCol, this.isAI);
    allPawns[this.row][this.col] = null;
    allPawns[newRow][newCol] = newPawn;
    return allPawns;
  }

}