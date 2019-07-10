class Board {
  constructor(DOMTable, playerPawnTemplate, AIPawnTemplate, rowsCount=3, colsCount=3) {
    this.DOMTable = DOMTable;
    this.playerPawnTemplate = playerPawnTemplate;
    this.AIPawnTemplate = AIPawnTemplate;
    this.rowsCount = rowsCount;
    this.colsCount = colsCount;

    this.setup();
  }


  setup() {
    let cell, pawn, pawnNode;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cell = this.DOMTable.children[row].children[col];
        pawn = pawnsObject.getPawn(row, col);
        if (pawn) {
          if (pawn.isAI) {
            pawnNode = this.AIPawnTemplate.content.cloneNode(true);
          } else {
            pawnNode = this.playerPawnTemplate.content.cloneNode(true);
          }
          cell.appendChild(pawnNode);
        }
        cell.addEventListener("click", (event) => {
          let thisCell = event.currentTarget;
          let thisPawn = pawnsObject.getPawn(row, col);
          if (thisPawn && !thisPawn.isAI) {
            if (thisPawn.isSelected) {
              this.resetHighlight();
            } else {
              thisPawn.select();
            }
          } else if (
            !thisCell.classList.contains("highlightedToAttack") &&
            !thisCell.classList.contains("highlightedToMove")
          ) {
            this.resetHighlight();
          }
        });
      }
    }
  }


  update(pawn) {
    this.emptyCell(pawn.row, pawn.col);
    pawnsObject.removePawn(pawn.lastRow, pawn.lastCol);
    if (pawnsObject.getPawn(pawn.row, pawn.col)) {
      pawnsObject.removePawn(pawn.row, pawn.col);
    }
    pawnsObject.addPawn(pawn);
    let oldPawnNode = this.DOMTable.children[pawn.lastRow].children[pawn.lastCol].firstElementChild;
    this.DOMTable.children[pawn.row].children[pawn.col].appendChild(oldPawnNode);
  }


  highlightCell(row, col, pawn) {
    let cell = this.DOMTable.children[row].children[col];
    let pawnCell = this.DOMTable.children[pawn.row].children[pawn.col];
    pawn.isSelected = true;
    if (pawnsObject.getPawn(row, col)) {
      cell.classList.add("highlightedToAttack");
      pawnCell.classList.add("highlightedAttackingPawn");
      cell.addEventListener("click", this.attackListenerForCell);
    } else {
      cell.classList.add("highlightedToMove");
      pawnCell.classList.add("highlightedMovingPawn");
      cell.addEventListener("click", this.moveListenerForCell);
    }
  }


  resetHighlight() {
    let cell;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cell = this.DOMTable.children[row].children[col];
        cell.classList.remove(
          "highlightedToMove",
          "highlightedToAttack",
          "highlightedMovingPawn",
          "highlightedAttackingPawn"
        );
        if (pawnsObject.getPawn(row, col)) {
          pawnsObject.getPawn(row, col).isSelected = false;
        }
        cell.removeEventListener("click", this.attackListenerForCell);
        cell.removeEventListener("click", this.moveListenerForCell);
      }
    }
  }


  emptyCell(row, col) {
    if (pawnsObject.getPawn(row, col)) {
      let cell = this.DOMTable.children[row].children[col];
      cell.removeChild(cell.firstElementChild);
    }
  }


  attackListenerForCell(event) {
    let attackingPawn = pawnsObject.getSelectedPawn();
    let thisCell = event.currentTarget;
    let cellCol = Array.prototype.slice.call(thisCell.parentNode.children).indexOf(thisCell);
    attackingPawn.move(cellCol - attackingPawn.col);
  }


  moveListenerForCell(event) {
    let movingPawn = pawnsObject.getSelectedPawn();
    let thisCell = event.currentTarget;
    let cellCol = Array.prototype.slice.call(thisCell.parentNode.children).indexOf(thisCell);
    movingPawn.move(cellCol - movingPawn.col);
  }
}