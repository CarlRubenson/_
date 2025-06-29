function hideAndShow() {
    var set = "shown";
    var del = "hidden";

    if (document.getElementsByClassName("hidden").length == 0){
        var set = "hidden";
        var del = "shown";
    }

    while (true){
        var target = document.getElementsByClassName(del)[0];
        target.classList.add(set);
        target.classList.remove(del);
        if (document.getElementsByClassName(del).length == 0){
            return;
        }
    }
}

document.addEventListener("click",_click);


function _click(event){
    var URL = event.target.getAttribute("href");
    if (URL != null){
        window.open(URL);
    } else if (event.target.getAttribute("func") == "showhide"){
        hideAndShow();
    }
}