function scorePieces(board){
    let weightedValues = [20, 5, 3, 2, 1];

    let blackScore = 0;
    let whiteScore = 0;
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const cell = board.grid[y][x];
            if (cell.disabled) continue;
            switch (cell.color) {
                case "B":
                    blackScore += weightedValues[getAttackDimensions(cell)];
                    break;
                case "W":
                    whiteScore += weightedValues[getAttackDimensions(cell)];
                    break;
                default:
                    continue;
            }
        }
    }


    if (board.debug){
        document.getElementById("bsInfo").textContent = blackScore;
        document.getElementById("wsInfo").textContent = whiteScore;
    }

    return {
        "black": blackScore,
        "white": whiteScore
    }
}


// Counts dimensions in which the cell can be turned
function getAttackDimensions(cell){
    let attackDimensions = 0;
    for (let i = 0; i < 4; i++){
        if (cell.neighbors[i] && cell.neighbors[i+4] && !cell.neighbors[i].disabled && !cell.neighbors[i+4].disabled) {
            attackDimensions++;
        }
    }
    
    return attackDimensions;
}

function getHypoFromCenter(cell, maxX, maxY){
    return Math.pow(2, (cell.x - (maxX - 1) / 2) + Math.pow(2, (cell.y - (maxY - 1) / 2)));
}


async function computerMove(board){

    if (board.possibleCells.length == 0) {
        updateBoard(board);
        return;
    }

    let cell = aiType[board[board.colorToMove]](board.possibleCells);

    await new Promise(r => setTimeout(r, aiSpeed.max - aiSpeed.value));

    makeMove(board, cell.x, cell.y);

}
