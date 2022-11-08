export function validateParameter(parameter, value, callback) {
    $.ajax({
        url: "/utils/validator",
        method: "GET",
        dataType: "json",
        data: {
            type: parameter,
            value: value
        },
        complete: (data, reason) => {
            callback(data.responseText == "True");
        }
    })
}