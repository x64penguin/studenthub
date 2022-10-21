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
    let email = $("#email");
    let password = $("#password");
    let password_confirm = $("#password_confirm");
    let password_err = $("#password-err");

    function on_change() {
        if (username.val() != "" && password.val() != "" && password_confirm.val() != "" && email.val() != "" &&
            password_confirm.val() == password.val() && email.val().search("@")) {
            $("#submit-btn").removeClass("btn-inactive");
        } else {
            $("#submit-btn").addClass("btn-inactive");
        }
    }

    function on_confirm_pass_change() {
        if (password.val() != password_confirm.val()) {
            password_confirm.addClass("input-invalid");
            password_err.css("display", "block");
        } else {
            password_confirm.removeClass("input-invalid");
            password_err.css("display", "none");
        }
    }

    function on_email_change() {
        if (email.val().search("@") == -1) {
            email.addClass("input-invalid");
        } else {
            email.removeClass("input-invalid");
        }
    }

    username.on("input", on_change);
    password.on("input", on_change);
    password_confirm.on("input", on_change);
    password_confirm.on("input", on_confirm_pass_change);
    email.on("input", on_email_change);
})