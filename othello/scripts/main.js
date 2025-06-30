const INIT_FUNCTION = (gridTemplate) => {
    'use strict';

    const grid = [];
    const maxWidth = Math.max(...gridTemplate.map(array => array.length));
    const maxHeight = gridTemplate.length;

    const gridElement = document.getElementById('grid');

    const board = {
        "maxY": maxHeight,
        "maxX": maxWidth,
        "colorToMove": "B",
        "grid": grid,
        "debug": false,
        "guidedMode": true,
        "endcounter": 0,
        "scoreBoxes": document.querySelectorAll('.infospan.left'),
        "el": gridElement,
        "possibleCells": [],
        "movecount": 0,
        "history": [],
        "computerColor": null
    };

    // Delete old game
    document.documentElement.removeAttribute("endcounter");
    while (gridElement.firstChild) {
        gridElement.removeChild(gridElement.firstChild);
    }
    infoText("");  // Clear winner
    if (!board.guidedMode) gridElement.setAttribute("unguided", "");
    if (!board.debug) {
        document.querySelectorAll(".debugitem").forEach((el) => el.classList.add("hidden"));
    }


    // Set cell size. Nr cells = cells + numbered labels; widtch based on height divided by nr cells + subtracted of the gap
    document.documentElement.style.setProperty('--gridCells', `${maxWidth}`);

    // Create grid
    for (let y = -1; y < maxHeight; y++) {
        if (y >= 0) grid[y] = [];
        for (let x = -1; x < maxWidth; x++) {
            if (y == -1 || x == -1) {
                const cell = document.createElement('div');
                cell.className = 'label';

                if (y == x) cell.textContent = " ";
                else if (y == -1) cell.textContent = x;
                else cell.textContent = y;


                gridElement.appendChild(cell);
                continue;
            }


            const gtCell = gridTemplate[y][x];
            const cellObj = { 
                "el": null,
                "x": x,
                "y": y,
                "disabled": false, 
                "possible": false,
                "color": "E"
            };

            const cell = cellObj.el = document.createElement('div');
            cell.className = 'cell';
            

            if (gtCell === undefined) { cell.classList.add('disabled'); cellObj.color = " "; cellObj.disabled = true; }
            else if (gtCell == 1) { cellObj.color = "B"; }
            else if (gtCell == 2) {  cellObj.color = "W"; }
            
            cell.setAttribute("x", x);
            cell.setAttribute("y", y);


            const marker = document.createElement('div');
            marker.className = 'marker';

            
            cell.appendChild(marker);
            gridElement.appendChild(cell);
            grid[y].push(cellObj);
        }
    }


    // Link neighbors
    for (let y = 0; y < maxHeight; y++) {
        for (let x = 0; x < maxWidth; x++) {
            const cell = grid[y][x];
            cell.neighbors = [
                grid[y-1]?.[x],     // N
                grid[y-1]?.[x+1],   // NE
                grid[y]?.[x+1],     // E
                grid[y+1]?.[x+1],   // SE
                grid[y+1]?.[x],     // S
                grid[y+1]?.[x-1],   // SW
                grid[y]?.[x-1],     // W
                grid[y-1]?.[x-1],   // NW
            ]
        }
    }

    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const cell = board.grid[y][x];
            if (cell.disabled) continue;
            cell.el.addEventListener("click", function(){
                if (!board.endcounter && !document.body.getAttribute("gameActive")) toggleActiveGame(true, board);
                makeMove(board, x, y);
            });
            
        }
    }
    
    updateBoard(board);
}




function printBoard(grid, type = "color"){
    if (type = "obj") console.log(grid);
    else console.log(grid.map(row => row.map(item => item[type])));
}


async function updateBoard(board){
    console.log(board.movecount++);

    if (document.documentElement.getAttribute("endcounter") == 2) {
        return console.log("Prevented ending loop");
    }

    board.possibleCells = [];
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const cell = board.grid[y][x];
            if (cell.disabled) continue;

            cell.el.className = 'cell';
            switch (cell.color) {
                case "B":
                    delete cell.pd;
                    cell.possible = false;
                    cell.el.className = "cell black";
                    break;
                case "W":
                    delete cell.pd;
                    cell.possible = false;
                    cell.el.className = "cell white";
                    break;
                case "E":
                    cell.pd = possibleDirections(cell, board.colorToMove);
                    if (cell.pd.includes(true)) { 
                        board.possibleCells.push(cell);
                        cell.possible = true 
                        cell.el.className = "cell empty possible";
                    }
                    else {
                        cell.possible = false;
                        cell.el.className = "cell empty impossible";
                    }
                    break;
                default:
                    cell.el.classList.add('empty', 'impossible');
            }
        }
    }

    highlightColor(board.colorToMove);
    if (board.colorToMove == "B"){
        document.documentElement.style.setProperty('--highlightColor', 'var(--blackColor)');
        document.documentElement.style.setProperty('--highlightRotation', 'rotateY(0deg)');
    } else {
        document.documentElement.style.setProperty('--highlightColor', 'var(--whiteColor)');
        document.documentElement.style.setProperty('--highlightRotation', 'rotateY(180deg)');
    }

    if (board.debug) printBoard(board.grid, "obj");

    countPieces(board);
    scorePieces(board);

    if (board.possibleCells.length == 0) {
        if (board.endcounter == 0){
            board.endcounter = 1;   // One player can't move
            document.documentElement.setAttribute("endcounter", board.endcounter);
            board.colorToMove = board.colorToMove == "B" ? "W" : "B";
            return updateBoard(board);
        } else if (board.endcounter == 1) {
            board.endcounter = 2;   // Neither player can move
            document.documentElement.setAttribute("endcounter", board.endcounter);
            endGameMessage(board);
            toggleActiveGame(false);
            return;
        }
    } else {

        if (board.endcounter > 0) console.log(`Double ${board.colorToMove}!`)

        board.endcounter = 0;
    }


/*     board.history.push(board);
    if (board.history.length > 10) board.history.pop(); 
 */
    if (activeGame() && (board.computerColor == board.colorToMove || board.computerColor == "both")) {
        document.documentElement.style.pointerEvents = "none"; 
        let tmp = document.documentElement.style.getPropertyValue('--bgColor');
        document.documentElement.style.setProperty('--boardColor', 'grey');
        await computerMove(board);
        document.documentElement.style.setProperty('--boardColor', tmp);
        document.documentElement.style.pointerEvents = "";
    }
}

function makeMove(board, x, y){
    const cell = board.grid[y][x];
    if (cell.disabled || !cell.possible) return board;

    cell.color = board.colorToMove;

    for (let i = 0; i < 8; i++){
        if (!cell.pd[i]) continue;
        board.grid = flip(cell.neighbors[i], board.grid, board.colorToMove, i);
    }
    board.colorToMove = board.colorToMove == "B" ? "W" : "B";
    
    updateBoard(board)
}


// Check possible directions for empty cell
function possibleDirections(cell, colorToMove){
    if (cell.color == "B" || cell.color == "W") return null;

    let inverseColor = colorToMove == "B" ? "W" : "B";
    return cell.neighbors.map((neighbor, i) => {
        if (neighbor?.color == inverseColor) return possibleDirection(neighbor, colorToMove, i);
        else return false;
    });

    function possibleDirection(cell, colorToMove, direction){
        if (!cell || cell.color == "E" || cell.disabled) return false;
        if (cell.color == colorToMove) return true
        return possibleDirection(cell.neighbors[direction], colorToMove, direction);
    }
}



function countPieces(board){

    let blackBricks = 0;
    let whiteBricks = 0;
    let emptyCells = 0;
    for (let y = 0; y < board.maxY; y++) {
        for (let x = 0; x < board.maxX; x++) {
            const cell = board.grid[y][x];
            if (cell.disabled) continue;
            switch (cell.color) {
                case "B":
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


function endGameMessage(board){

    const pieceCount = countPieces(board);

    let str = "";
    if (pieceCount.black > pieceCount.white){
        highlightColor("B");
        infoText("Svart vann!"); 
    } else if (pieceCount.white > pieceCount.black) {
        highlightColor("W");
        infoText("Vit vann!"); 
    } else {
        infoText("Oavgjort!"); 
    }

    str = `${str}
    
Svarta: ${pieceCount.black}    
Vita:   ${pieceCount.white}
(Tomma: ${pieceCount.empty})

Spela igen?
    `

    return str;
}


function flip(cell, grid, colorToMove, direction){
    if (!cell || cell.color == "E" || cell.color == colorToMove) return grid;
    cell.color = colorToMove;
    return flip(cell.neighbors[direction], grid, colorToMove, direction);
}

function infoText(str){
    infopanel.getElementsByTagName("h1")[0].textContent = str;
}

const MAIN = () => {

    let boardIndex = 0;
    let templates = Object.values(boardTemplates);

    INIT_FUNCTION( templates[0] );

    document.getElementById("newGame").addEventListener("click", () => {
        toggleActiveGame(false);
        INIT_FUNCTION( templates[boardIndex] );
    } );
    document.getElementById("cycleTypes").addEventListener("click", (e) => {
        toggleActiveGame(false);
        if (e.shiftKey) {
            if (--boardIndex == -1 ) boardIndex = templates.length - 1;
        } else if (++boardIndex == templates.length ) {
            boardIndex = 0;
        }
        INIT_FUNCTION( templates[boardIndex] );
    });
    
}



function highlightColor(color){
    if (color == "B"){
        document.getElementById("blackLabel").classList.add("bold");
        document.getElementById("whiteLabel").classList.remove("bold");
    } else {
        document.getElementById("whiteLabel").classList.add("bold");
        document.getElementById("blackLabel").classList.remove("bold");
    }
}

window.onload = MAIN;



