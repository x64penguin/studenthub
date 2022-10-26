$(function(){
    let header_menu = $(".header__menu");
    let menu_button = $(".menu-button");
    let menu_dropdown = $(".menu-dropdown");
    menu_button.click(function(){
        let new_opacity = Math.abs(1 - menu_dropdown.css("opacity"));
        menu_dropdown.css("opacity", new_opacity);
        if (new_opacity == 1) {
            menu_dropdown.css("pointer-events", "auto");
        } else {
            menu_dropdown.css("pointer-events", "none");
        }
    })

    $(window).click(function(event){
        let target = $(event.target);
        if (!$.contains(header_menu[0], target[0])) {
            menu_dropdown.css("opacity", "0");
            menu_dropdown.css("pointer-events", "none");
        }
    })

    let username = $("#username");
    let password = $("#password");

    function on_change() {
        if (username.val() != "" && password.val() != "") {
            $("#submit-btn").removeClass("btn-inactive");
        } else {
            $("#submit-btn").addClass("btn-inactive");
        }
    }
    username.on("input", on_change);
    password.on("input", on_change);
})