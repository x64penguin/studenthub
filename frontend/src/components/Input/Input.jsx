import "./Input.css";
const classnames = require("classnames");

export function Input({
        invalid = false,
        label,
        placeholder = "",
        type = "text",
        value = "",
        className = "",
        onChange
    }) {

    const classes = classnames({
        "input-default": true,
        invalid: typeof invalid === "boolean" ? invalid : invalid(),
    });

    if (!label) {
        return (
            <input
                type={type}
                className={classes + " " + className}
                placeholder={placeholder}
                onChange={onChange}
                defaultValue={value || ""}
            />
        );
    } else {
        return (
            <div className={"input-group " + className}>
                <label>{label}</label>
                <input
                    type={type}
                    className={classes}
                    placeholder={placeholder}
                    onChange={onChange}
                    defaultValue={value || ""}
                />
            </div>
        );
    }
}
