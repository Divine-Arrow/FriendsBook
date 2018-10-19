$(document).ready(() => {
    $("nav").remove();
    $("#fotter").remove();
    $("#fotter_bottom").remove();
    $("body").css('overflow', 'hidden');


    /* Menu bar chat */
    $(".menu_dots").click(() => {
        toogleChatMenu();
    });
    $(".back").click(() => {
        toogleChatMenu();
    });

    // reusable function
    const toogleChatMenu = () => {
        $(".menu_options").toggleClass("menu_option_hide");
        $(".back").toggleClass("back_toggle");
    }


});