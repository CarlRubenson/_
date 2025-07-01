

function toggleGuidedMode(){
    if (document.getElementById("grid").getAttribute("unguided") == "") document.getElementById("grid").removeAttribute("unguided");
    else document.getElementById("grid").setAttribute("unguided", "");
}

function toggleScores(){
    if (document.getElementById("infopanel").getAttribute("hidden") == "") document.getElementById("infopanel").removeAttribute("hidden");
    else document.getElementById("infopanel").setAttribute("hidden", "");
}

function toggleActiveGame(activate = null, board){
    if (activate === null) activate = !!document.body.getAttribute("gameActive");

    if (!activate) document.body.removeAttribute("gameActive");
    else {
        document.body.setAttribute("gameActive", "active");
        if (board && board[board.colorToMove] != "Human") computerMove(board);
    }
}


function toggleNumbers(){
    const current = document.documentElement.style.getPropertyValue("--numbersDisplay") || getComputedStyle(document.documentElement).getPropertyValue("--numbersDisplay");

    if (current == "flex"){
        document.documentElement.style.setProperty("--numbersDisplay", "none");
        document.documentElement.style.setProperty("--numbersSpacer", "0");
    } else {
        document.documentElement.style.setProperty("--numbersDisplay", "flex");
        document.documentElement.style.setProperty("--numbersSpacer", "1");
    }
}


function activeGame(){
    return !!document.body.getAttribute("gameActive");
}

function highlightNewgame(){
    document.getElementById("newGame").setAttribute("highlight", "");
}

function toggleEmilyMode(){
    if (document.body.getAttribute("colorMode") == "Emily"){
        document.body.setAttribute("colorMode", "standard")/* 
        document.documentElement.style.setProperty("--bgColor", "#083");
        document.documentElement.style.setProperty("--blackColor", "#000");
        document.documentElement.style.setProperty("--blackColorLightened", "#333");
        document.documentElement.style.setProperty("--whiteColor", "#fff");
        document.documentElement.style.setProperty("--whiteColorDarkened", "#ccc"); */
    } else {
        document.body.setAttribute("colorMode", "Emily")
       /*  document.documentElement.style.setProperty("--bgColor", "#083");
        document.documentElement.style.setProperty("--blackColor", "#000");
        document.documentElement.style.setProperty("--blackColorLightened", "#333");
        document.documentElement.style.setProperty("--whiteColor", "#fff");
        document.documentElement.style.setProperty("--whiteColorDarkened", "#ccc"); */
    }
}