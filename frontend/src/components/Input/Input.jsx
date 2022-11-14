import "./Input.css"
const classnames = require("classnames");

export function Input(props) {
    const {
        invalid = false,
        label = "",
        placeholder = "",
        type = "text",
        onChange,
    } = props;

    const classes = classnames({
        "input-default": true,
        "input-invalid": invalid
    })

    return <>
        <label className="input-label">{label}</label>
        <input type={type} className={classes} placeholder={placeholder} onChange={onChange}/>
    </>
}