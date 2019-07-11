class Board {
  constructor(DOMTable, playerPawnTemplate, AIPawnTemplate) {
    this.DOMTable = DOMTable;
    this.playerPawnTemplate = playerPawnTemplate;
    this.AIPawnTemplate = AIPawnTemplate;

    this.setup();
  }


  setup() {
    let cell, pawn, pawnNode;
    for (let row = 0; row < ROWS_COUNT; row++) {
      for (let col = 0; col < COLS_COUNT; col++) {
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
    pawnsObject.updatePawn(pawn);
    let oldPawnNode = this.DOMTable.children[pawn.lastRow].children[pawn.lastCol].firstElementChild;
    this.DOMTable.children[pawn.row].children[pawn.col].appendChild(oldPawnNode);
  }


  highlightCell(row, col, pawn) {
    let cell = this.DOMTable.children[row].children[col];
    let pawnCell = this.DOMTable.children[pawn.row].children[pawn.col];
    pawnCell.firstElementChild.classList.add("selectedPawn");
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


  highlightCellForAI(row, col, pawn) {
    let cell = this.DOMTable.children[row].children[col];
    let pawnCell = this.DOMTable.children[pawn.row].children[pawn.col];
    pawnCell.firstElementChild.classList.add("selectedPawn");
    if (pawnsObject.getPawn(row, col)) {
      cell.classList.add("highlightedToAttack");
      pawnCell.classList.add("highlightedAttackingPawn");
    } else {
      cell.classList.add("highlightedToMove");
      pawnCell.classList.add("highlightedMovingPawn");
    }
  }


  highlightBadCell(row, col, pawn) {
    this.DOMTable.children[pawn.row].children[pawn.col].firstElementChild.classList.add("selectedPawn");
    let cell = this.DOMTable.children[row].children[col];
    cell.classList.add("badCell");
  }


  resetHighlight() {
    let cell;
    for (let row = 0; row < ROWS_COUNT; row++) {
      for (let col = 0; col < COLS_COUNT; col++) {
        cell = this.DOMTable.children[row].children[col];
        cell.classList.remove(
          "badCell",
          "highlightedToMove",
          "highlightedToAttack",
          "highlightedMovingPawn",
          "highlightedAttackingPawn"
        );
        if (pawnsObject.getPawn(row, col)) {
          pawnsObject.getPawn(row, col).isSelected = false;
          cell.firstElementChild.classList.remove("selectedPawn");
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