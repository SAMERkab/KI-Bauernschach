class Board {
    constructor(DOMTable, pawnTemplate, pawns) {
        this.DOMTable = DOMTable;
        this.pawnTemplate = pawnTemplate;
        this.pawns = pawns;
        this.setup();
    }


    setup() {
        for (let pawn of this.pawns) {
            this.addPawnNodeToCell(pawn);
        }
    }


    addPawnNodeToCell(pawn) {
        let pawnNode = this.pawnTemplate.content.cloneNode(true);
        this.DOMTable.children[pawn.row].children[pawn.col].appendChild(pawnNode);
        pawnNode = this.DOMTable.children[pawn.row].children[pawn.col].lastElementChild;
        pawnNode.addEventListener("click", () => {
            pawn.select();
        });
    }


    update(pawns) {
        if (Array.isArray(pawns)) {
            this.pawns = pawns;
            this.setup();
        } else {
            let pawn = pawns;
            let oldPawnNode = this.DOMTable.children[pawn.lastRow].children[pawn.lastCol].firstElementChild;
            oldPawnNode.parentNode.removeChild(oldPawnNode);
            this.addPawnNodeToCell(pawn);
        }
    }


    cellIsOccupied(row, col) {
        return this.DOMTable.children[row].children[col].children.length > 0;
    }


    highlightCell(row, col, pawn) {
        let cell = this.DOMTable.children[row].children[col];
        if (this.cellIsOccupied(row, col)) {
            cell.classList.add("highlightedToAttack");
            cell.addEventListener("click", () => {
                this.emptyCell(row, col);
                this.pawns = this.pawns.filter(pawn => pawn.row !== row && pawn.col !== col);
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
        let cell;
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                cell = this.DOMTable.children[row].children[col];
                cell.classList.remove("highlightedToMove", "highlightedToAttack");
                this.removeAllListenersOfElem(cell);
            }
        }
    }


    emptyCell(row, col) {
        let cell = this.DOMTable.children[row].children[col];
        cell.removeChild(cell.firstElementChild);
    }


    removeAllListenersOfElem(elem) {
        let clone = elem.cloneNode(true);
        elem.parentNode.replaceChild(clone, elem);
    }


    getPawnAt(row, col) {
        for (let pawn of this.pawns) {
            if (pawn.row === row && pawn.col === col)
                return pawn;
        }
        return null;
    }
}