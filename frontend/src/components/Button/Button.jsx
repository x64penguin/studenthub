import classNames from "classnames"
import "./Button.css"

export function Button(props) {
    const {
        className="",
        onClick,
        children,
        type="button",
        style="primary"
    } = props;
    return <button type={type} className={className + " controls button " + style} onClick={onClick}>
        {children}
    </button>
}