var scollAnimation = function () {
    xAxis = scrollX;
    yAxis = scrollY;
    if (yAxis < $('.navbar').innerHeight()) {
        $('.navbar').css("background-color", "transparent");
    } else if (yAxis > $('.navbar').innerHeight()) {
        $('.navbar').css("background-color", "#f6fbfe");
    }
}


window.addEventListener("scroll", scollAnimation);