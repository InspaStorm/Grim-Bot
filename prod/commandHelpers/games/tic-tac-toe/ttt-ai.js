export default class TicTacToeAI {
    constructor(bareBoard) {
        this.playableAreas = bareBoard;
        console.log(this.playableAreas);
    }
    deleteEmptyRow(board) {
        let rowIndex = 0;
        // Removes empty row
        for (let row of board) {
            if (row.length == 0) {
                board.splice(rowIndex, 1);
            }
            rowIndex++;
        }
        return board;
    }
    markCellPlayed(cellNum) {
        let currentCellIndex = 0;
        let currentRowIndex = 0;
        for (let row of this.playableAreas) {
            for (let cell of row) {
                if (cell === cellNum) {
                    this.playableAreas[currentRowIndex][currentCellIndex] = 0;
                }
                else {
                    currentCellIndex++;
                }
            }
            currentRowIndex++;
            currentCellIndex = 0;
        }
        console.log(this.playableAreas, cellNum);
    }
    //  get random cell on 3 x 3 board
    getRandomCell() {
        let randRowIndex = Math.floor(Math.random() * 3);
        let randCellIndex = Math.floor(Math.random() * 3);
        let foundPlayableCell = false;
        while (!foundPlayableCell) {
            if (this.playableAreas[randRowIndex][randCellIndex] != 0) {
                foundPlayableCell = true;
                return {
                    rowIndex: randRowIndex,
                    cellIndex: randCellIndex,
                    number: this.playableAreas[randRowIndex][randCellIndex],
                };
            }
            else {
                randRowIndex = Math.floor(Math.random() * 3);
                randCellIndex = Math.floor(Math.random() * 3);
            }
        }
        return;
    }
    play() {
        let randPos;
        randPos = this.getRandomCell();
        this.markCellPlayed(randPos.number);
        return randPos;
    }
}
