

function toggleGuidedMode(){
    if (document.getElementById("grid").getAttribute("unguided") == "") document.getElementById("grid").removeAttribute("unguided");
    else document.getElementById("grid").setAttribute("unguided", "");
}

function toggleScores(){
    if (document.getElementById("scores").getAttribute("hidden") == "") document.getElementById("scores").removeAttribute("hidden");
    else document.getElementById("scores").setAttribute("hidden", "");
}

function toggleActiveGame(activate = null, board){
    if (activate === null) activate = !!document.body.getAttribute("gameActive");

    if (!activate) document.body.removeAttribute("gameActive");
    else {
        document.body.setAttribute("gameActive", "active");
        if (board && (board.computerColor == board.colorToMove || board.computerColor == "both")) computerMove(board);
    }
}

function activeGame(){
    return !!document.body.getAttribute("gameActive");
}