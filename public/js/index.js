var scollAnimation = function () {
    xAxis = scrollX;
    yAxis = scrollY;
    if (yAxis < $('.navbar').innerHeight()) {
        $('.navbar').removeClass('navActive');
    } else if (yAxis > $('.navbar').innerHeight()) {
        $('.navbar').addClass('navActive');
    }
}


window.addEventListener("scroll", scollAnimation);