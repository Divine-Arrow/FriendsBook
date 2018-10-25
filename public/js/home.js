// scroll navbar
window.addEventListener("scroll", () => {
    xAxis = scrollX;
    yAxis = scrollY;
    if (yAxis < $('.navbar').innerHeight()) {
        $('.navbar').removeClass('navActive');
    } else if (yAxis > $('.navbar').innerHeight()) {
        $('.navbar').addClass('navActive');
    }
});

// shape dance
$(document).ready(() => {
    var left_shape = $('.shape_left');
    var right_shape = $('.shape_right');
    left_shape.toggleClass('rotate_more_l')
    right_shape.toggleClass('rotate_more_r')
    var changeit = () => {
        left_shape.toggleClass('rotate_more_l');
        right_shape.toggleClass('rotate_more_r');
    }
    setInterval(changeit, 5000);
});


//  menu click
$('.navbar-toggler').on('click', () => {
    $('.navbar').toggleClass('navActiveToggle');
    $('.back').toggleClass('nav_menu_back');
})


