import { validateParameter } from "./modules/utils.js";

$(() => {
    let username = $("#username");
    let email = $("#email");
    let password = $("#password");
    let passwordConfirm = $("#password_confirm");
    let passwordErr = $("#password-err");
    let submit = $("#submit-btn");

    function onChange() {
        if (username.val() != "" && password.val() != "" && passwordConfirm.val() != "" && email.val() != "" &&
            passwordConfirm.val() == password.val() && email.val().search("@") != -1) {
            $("#submit-btn").removeClass("disabled-btn");
        } else {
            $("#submit-btn").addClass("disabled-btn");
        }
    }

    function onConfirmPassChange() {
        onChange();
        if (password.val() != passwordConfirm.val()) {
            passwordConfirm.addClass("input-invalid");
            passwordErr.css("display", "block");
        } else {
            passwordConfirm.removeClass("input-invalid");
            passwordErr.css("display", "none");
        }
    }

    function onEmailChange() {
        onChange();
        if (email.val().search("@") == -1) {
            email.addClass("input-invalid");
        } else {
            email.removeClass("input-invalid");
        }
    }

    function onUsernmaeChange() {
        onChange();
        validateParameter("username", username.val(),
            (validated) => {
                if (!validated) {
                    username.addClass("input-invalid");
                }
                else {
                    username.removeClass("input-invalid");
                    $("#username-err").addClass("d-none");
                }
            }
        );
    }

    function onSubmit(e) {
        if (username.hasClass("input-invalid")) {
            $("#username-err").removeClass("d-none");
            e.preventDefault();
        }
    }

    username.on("input", onUsernmaeChange);
    password.on("input", onChange);
    passwordConfirm.on("input", onConfirmPassChange);
    email.on("input", onEmailChange);
    submit.click(onSubmit);
})