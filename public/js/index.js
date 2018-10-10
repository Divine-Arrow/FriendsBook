 window.addEventListener("scroll", () => {
     xAxis = scrollX;
     yAxis = scrollY;
     if (yAxis < $('.navbar').innerHeight()) {
         $('.navbar').removeClass('navActive');
     } else if (yAxis > $('.navbar').innerHeight()) {
         $('.navbar').addClass('navActive');
     }
 });

 $('.navbar-toggler').on('click', () => {
     $('.navbar').toggleClass('navActiveToggle');
 })

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


 /* loader */
 /* loader animation removal */
 var clicked = false;
 var stopScroll = () => {
     window.scroll(xAxis, yAxis);
 }
 var loader = () => {
     $(".loader_container").css('top', '-100vh');
     $(".loader_container").css('opacity, 0');
     clicked = !clicked;
     window.removeEventListener("scroll", stopScroll);
 }

 /* loader listener */
 window.addEventListener("load", () => {
     xAxis = 0;
     yAxis = 0;
     clicked = !clicked;
     window.addEventListener("scroll", stopScroll);
     loader();
 });