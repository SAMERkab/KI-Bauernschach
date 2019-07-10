class Board {
  constructor(DOMTable, pawnTemplate, pawns, rowsCount=3, colsCount=3) {
    this.DOMTable = DOMTable;
    this.pawnTemplate = pawnTemplate;
    this.pawns = pawns;
    this.rowsCount = rowsCount;
    this.colsCount = colsCount;
    this.setup();
  }


  setup() {
    let cell, pawnNode;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        cell = this.DOMTable.children[row].children[col];
        if (this.cellIsOccupied(row, col)) {
          pawnNode = this.pawnTemplate.content.cloneNode(true);
          cell.appendChild(pawnNode);
        }
        cell.addEventListener("click", (event) => {
          if (this.cellIsOccupied(row, col) && !this.pawns[row][col].isAI) {
            this.pawns[row][col].select();
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
    this.resetHighlight();
    pawn.isSelected = true;
    if (this.cellIsOccupied(row, col)) {
      cell.classList.add("highlightedToAttack");
      pawnCell.classList.add("highlightedAttackingPawn");
      cell.addEventListener("click", () => {
        if (pawn.isSelected) {
          this.emptyCell(row, col);
          this.pawns[row][col] = null;
          pawn.move(col - pawn.col);
        }
      });
    } else {
      cell.classList.add("highlightedToMove");
      pawnCell.classList.add("highlightedMovingPawn");
      cell.addEventListener("click", () => {
        if (pawn.isSelected) {
          pawn.move(col - pawn.col);
        }
      });
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
      }
    }
  }


  emptyCell(row, col) {
    let cell = this.DOMTable.children[row].children[col];
    cell.removeChild(cell.firstElementChild);
  }


  getPawnAt(row, col) {
    return this.pawns[row][col];
  }
}