const newElement = document.createElement;

$(function() {
    let header_menu = $(".nav__menu");
    let profile = $(".nav__profile");
    let menu_dropdown = $(".menu-dropdown");
    let profile_dropdown = $(".profile-dropdown");

    $(".menu-button").click(function(){
        let new_opacity = 1 - menu_dropdown.css("opacity");
        menu_dropdown.css("opacity", new_opacity);
        menu_dropdown.css("pointer-events", new_opacity == 1 ? "auto" : "none");
    })

    $(".nav__profile-block").click(function(){
        let new_opacity = 1 - profile_dropdown.css("opacity");
        profile_dropdown.css("opacity", new_opacity);
        profile_dropdown.css("pointer-events", new_opacity == 1 ? "auto" : "none");
    })

    $(window).click(function(event){
        let target = $(event.target);
        if (!$.contains(header_menu[0], target[0])) {
            menu_dropdown.css("opacity", "0");
            menu_dropdown.css("pointer-events", "none");
        }

        if (!$.contains(profile[0], target[0])) {
            profile_dropdown.css("opacity", 0);
            profile_dropdown.css("pointer-events", "none");
        }
    })
});