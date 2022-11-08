$(function() {
    let username = $("#username");
    let password = $("#password");

    function validate_fields() {
        if (username.val() != "" && password.val() != "") {
            $("#submit-btn").removeClass("disabled-btn");
        } else {
            $("#submit-btn").addClass("disabled-btn");
        }
    }

    username.on("input", validate_fields);
    password.on("input", validate_fields);
})