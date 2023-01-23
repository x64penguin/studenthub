import { Link } from "react-router-dom";
import "./Dropdown.css"

const classNames = require("classnames");

export function Dropdown(props) {
    const {
        children, 
        opened, 
        className = "",
        onClick
    } = props;

    let dropClass = classNames({
        "block-default": true,
        "dropdown": true,
        "dd-hidden": !opened
    })

    return <div onClick={onClick} className={className + dropClass}>
        { children }
    </div>
}

export function DropdownItem(props) {
    const {
        className = "",
        onClick,
        link,
        children
    } = props;

    if (link) {
        return <Link to={link} className={className + " dropdown-item"} onClick={onClick}>{children}</Link>; 
    }
    return <span className={className + " dropdown-item"} onClick={onClick}>{children}</span>
}