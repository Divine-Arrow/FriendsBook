$(document).ready(() => {
    $("nav").remove();
    $("#fotter").remove();
    $("#fotter_bottom").remove();
    $("body").css('overflow', 'hidden');

    /* Menu bar chat */
    $(".menu_dots").click(() => {
        toogleChatMenu();
        $(".back").click(() => {
            toogleChatMenu();
        });
    });
    $(".back").click(() => {
        toogleChatMenu();
    });
    // reusable function
    const toogleChatMenu = () => {
        $(".menu_options").toggleClass("menu_option_toggle");
        $(".back").toggleClass("back_toggle");
    }



    /* Menu bar chat for mobile*/
    $(".m_chats").click(() => {
        $(".chat_list_wrapper").toggleClass("m_chats_hider");
        $(".back").toggleClass("back_toggle");
        $(".back").unbind("click");
    });
    $(".mobile_menu").click(() => {
        $(".chat_list_wrapper").toggleClass("m_chats_hider");
        $(".back").toggleClass("back_toggle");
    });
    // menu for mobile
    $(".m_menu").click(() => {
        $(".menu_options").toggleClass("menu_option_toggle");
        $(".back").toggleClass("back_toggle");
    })
});