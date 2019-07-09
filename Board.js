class Board {
    constructor(DOMTable, pawnTemplate, pawns) {
        this.DOMTable = DOMTable;
        this.pawnTemplate = pawnTemplate;
        this.pawns = pawns;
        this.setup();
    }


    setup() {
        let pawnNode;
        for (let pawn of this.pawns) {
            pawnNode = this.pawnTemplate.content.cloneNode(true);
            this.DOMTable.children[pawn.row].children[pawn.col].appendChild(pawnNode);
        }
    }


    update(pawns) {
        if (Array.isArray(pawns)) {
            this.pawns = pawns;
            this.setup();
        } else {
            let oldPawnNode = this.DOMTable.children[pawns.lastRow].children[pawns.lastCol].firstElementChild;
            this.DOMTable.children[pawns.lastRow].children[pawns.lastCol].appendChild(oldPawnNode);
        }
    }


    cellIsOccupied(row, col) {
        return typeof this.DOMTable.children[row].children[col].firstElementChild !== "undefined";
    }


    highlightCell(row, col, pawn) {
        let cell = this.DOMTable.children[row].children[col];
        if (this.cellIsOccupied(row, col)) {
            cell.classList.add("highlightedToAttack");
            cell.addEventListener("click", () => {
                this.emptyCell(row, col);
                pawn.move(col - pawn.col);
            });
        } else {
            cell.classList.add("highlightedToMove");
            cell.addEventListener("click", () => {
                pawn.move(col - pawn.col);
            });
        }
    }


    resetHighlight() {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                this.DOMTable.children[row].children[col].classList.remove("highlightedToMove", "highlightedToAttack");
            }
        }
    }


    emptyCell(row, col) {
        cell = this.DOMTable.children[row].children[col];
        cell.removeChild(cell.firstElementChild);
    }
}