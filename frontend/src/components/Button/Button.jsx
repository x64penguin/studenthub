import classNames from "classnames"
import "./Button.css"

export function Button(props) {
    const {
        className="",
        onClick,
        children,
        type="primary"
    } = props;
    return <button className={className + " controls button " + type} onClick={onClick}>
        {children}
    </button>
}