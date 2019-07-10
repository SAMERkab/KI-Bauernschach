class Board {
  constructor(DOMTable, pawns, playerPawnTemplate, AIPawnTemplate, rowsCount=3, colsCount=3) {
    this.DOMTable = DOMTable;
    this.pawns = pawns;
    this.playerPawnTemplate = playerPawnTemplate;
    this.AIPawnTemplate = AIPawnTemplate;
    this.rowsCount = rowsCount;
    this.colsCount = colsCount;

    this.attackListenerForCell = this.unboundAttackListenerForCell.bind(this);
    this.moveListenerForCell = this.unboundMoveListenerForCell.bind(this);

    this.setup();
  }


  setup() {
    let cell, pawnNode;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cell = this.DOMTable.children[row].children[col];
        if (this.cellIsOccupied(row, col)) {
          if (this.pawns[row][col].isAI) {
            pawnNode = this.AIPawnTemplate.content.cloneNode(true);
          } else {
            pawnNode = this.playerPawnTemplate.content.cloneNode(true);
          }
          cell.appendChild(pawnNode);
        }
        cell.addEventListener("click", (event) => {
          let thisCell = event.currentTarget;
          if (this.cellIsOccupied(row, col) && !this.pawns[row][col].isAI) {
            if (this.pawns[row][col].isSelected) {
              this.resetHighlight();
            } else {
              this.pawns[row][col].select();
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


  update(pawns) {
    if (Array.isArray(pawns)) {
      this.pawns = pawns;
      this.setup();
    } else {
      let pawn = pawns;
      this.pawns[pawn.lastRow][pawn.lastCol] = null;
      this.pawns[pawn.row][pawn.col] = pawn;
      let oldPawnNode = this.DOMTable.children[pawn.lastRow].children[pawn.lastCol].firstElementChild;
      this.DOMTable.children[pawn.row].children[pawn.col].appendChild(oldPawnNode);
    }
  }


  cellIsOccupied(row, col) {
    return this.pawns[row][col] !== null;
  }


  highlightCell(row, col, pawn) {
    let cell = this.DOMTable.children[row].children[col];
    let pawnCell = this.DOMTable.children[pawn.row].children[pawn.col];
    pawn.isSelected = true;
    if (this.cellIsOccupied(row, col)) {
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
        if (this.cellIsOccupied(row, col)) {
          this.pawns[row][col].isSelected = false;
        }
        cell.removeEventListener("click", this.attackListenerForCell);
        cell.removeEventListener("click", this.moveListenerForCell);
      }
    }
  }


  emptyCell(row, col) {
    let cell = this.DOMTable.children[row].children[col];
    cell.removeChild(cell.firstElementChild);
  }


  getSelectedPawn() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.cellIsOccupied(row, col) && this.pawns[row][col].isSelected) {
          return this.pawns[row][col];
        }
      }
    }
    return null;
  }


  unboundAttackListenerForCell(event) {
    let attackingPawn = this.getSelectedPawn();
    let thisCell = event.currentTarget;
    let cellRow = Array.prototype.slice.call(this.DOMTable.children).indexOf(thisCell.parentNode);
    let cellCol = Array.prototype.slice.call(thisCell.parentNode.children).indexOf(thisCell);
    this.emptyCell(cellRow, cellCol);
    this.pawns[cellRow][cellCol] = null;
    attackingPawn.move(cellCol - attackingPawn.col);
  }


  unboundMoveListenerForCell(event) {
    let movingPawn = this.getSelectedPawn();
    let thisCell = event.currentTarget;
    let cellCol = Array.prototype.slice.call(thisCell.parentNode.children).indexOf(thisCell);
    movingPawn.move(cellCol - movingPawn.col);
  }
}