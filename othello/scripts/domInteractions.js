

function toggleGuidedMode(){
    if (document.getElementById("grid").getAttribute("unguided") == "") document.getElementById("grid").removeAttribute("unguided");
    else document.getElementById("grid").setAttribute("unguided", "");
}

function toggleScores(){
    if (document.getElementById("scores").getAttribute("hidden") == "") document.getElementById("scores").removeAttribute("hidden");
    else document.getElementById("scores").setAttribute("hidden", "");
}