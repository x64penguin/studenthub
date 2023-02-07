import "./Input.css";
const classnames = require("classnames");

export function Input({
        invalid = false,
        label,
        placeholder = "",
        type = "text",
        value = "",
        className = "",
        autocomplete = "off",
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
                autoComplete={autocomplete}
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
                    autoComplete={autocomplete}
                />
            </div>
        );
    }
}
