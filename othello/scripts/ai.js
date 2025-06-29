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

/*     const dyes = ["#F00", "#FC0", "#FF0", "#0F0"];
    cell.el.style.backgroundColor = dyes[attackDimensions]; */

    return attackDimensions;
}


async function computerMove(board){

    if (board.possibleCells.length == 0) {
        updateBoard(board);
        return;
    }

    let cell = board.colorToMove == "B" ? randomBestMove(board.possibleCells) : random(board.possibleCells);

    await new Promise(r => setTimeout(r, 50));

    makeMove(board, cell.x, cell.y);

}

// Will just select a random possible move
function random(possibleCells){
    let move = Math.floor(Math.random() * possibleCells.length);
    return possibleCells[move];
}


// Will sort possible moves by attack dimensions and pick a random one of the best ones at the moment
function randomBestMove(possibleCells){
    let sortedPossible = possibleCells.map(cell => {
        return [getAttackDimensions(cell), cell];
    });

    sortedPossible.sort((a,b) => {
        if (a[0] == b[0]) return Math.random() - 0.5;
        else return a[0] - b[0];
    })

    return sortedPossible[0][1];
}