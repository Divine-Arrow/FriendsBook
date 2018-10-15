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