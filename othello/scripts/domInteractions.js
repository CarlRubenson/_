

function toggleGuidedMode(){
    if (document.getElementById("grid").getAttribute("unguided") == "") document.getElementById("grid").removeAttribute("unguided");
    else document.getElementById("grid").setAttribute("unguided", "");
}



