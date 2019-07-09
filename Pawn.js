class Pawn {
    constructor(row, col, isAI) {
        this.row = row;
        this.col = col;
        this.lastRow = null;
        this.lastCol = null;
        this.isAI = isAI;
    }


    move(dir) {
        this.lastRow = this.row;
        this.lastCol = this.col;
        this.row += this.isAI ? -1 : 1;
        this.col += dir;
        board.update(this);
        board.resetHighlight();
    }


    select() {
        if (!this.isAI) {
            let allowedMoves = this.getAllowedMoves();
            for (let move of allowedMoves) {
                board.highlightCell(this.row+1, this.col+move);
            }
        }
    }


    getAllowedMoves() {
        let allowedMoves;

        if (this.isAI) {

        } else {
            if ( !board.cellIsOccupied(this.row+1, this.col) )
                allowedMoves.push(0);
            if ( this.col > 0 && board.cellIsOccupied(this.row+1, this.col-1))
                allowedMoves.push(-1);
            if ( this.col < 2 && board.cellIsOccupied(this.row+1, this.col+1))
                allowedMoves.push(1);
        }

        return allowedMoves;
    }
}