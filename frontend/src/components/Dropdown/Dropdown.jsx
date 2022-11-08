import { useState } from "react";
const classNames = require("classnames");

export function Dropdown(props) {
    const {
        children, 
        opened, 
        className = ""
    } = props;

    let dropClass = classNames({
        "dropdown": true,
        "dropdown-hidden": !opened
    })

    return <div className={className + dropClass}>
        { children }
    </div>
}

export function DDItem(props) {
    const {
        className = "",
        onClick,
        children
    } = props;
    return <span className={className + " dropdown-item"} onClick={onClick}>{children}</span>
}