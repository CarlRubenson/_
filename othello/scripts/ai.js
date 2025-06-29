function scorePieces(board){

    let blackBricks = 0;
    let whiteBricks = 0;
    let emptyCells = 0;
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const cell = board.grid[y][x];
            if (cell.disabled) continue;
            switch (cell.color) {
                case "B":
                    cell
                    blackBricks++;
                    break;
                case "W":
                    whiteBricks++;
                    break;
                case "E":
                    emptyCells++;
                    break;
                default:
                    // Nothing
            }
        }
    }

    board.scoreBoxes[0].textContent = blackBricks;
    board.scoreBoxes[1].textContent = whiteBricks;
    board.scoreBoxes[2].textContent = emptyCells;

    return {
        "black": blackBricks,
        "white": whiteBricks,
        "empty": emptyCells
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

    const dyes = ["#F00", "#FC0", "#FF0", "#0F0"];

    cell.el.style.backgroundColor = dyes[attackDimensions];
    cell.el.textContent = attackDimensions;
    console.log(attackDimensions);
}