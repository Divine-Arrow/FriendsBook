$(document).ready(() => {
    $("nav").remove();
    $("#fotter").remove();
    $("#fotter_bottom").remove();
    $("body").css('overflow', 'hidden');


    /* Menu dot */
    $(".menu_dots").click(()=>{
        $(".menu_options").toggleClass("menu_option_hide");
        $(".menu_container").toggleClass("backFade");
    });
    $(".menu_container").click(()=>{
        $(".menu_options").toggleClass("menu_option_hide");
        $(".menu_container").toggleClass("backFade");
    });


});

