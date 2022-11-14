import classNames from "classnames";
import React, { useState } from "react";
import "./Select.css"

export function Option(props) {
    const {
        onClick,
        children,
    } = props;

    return <span className="select__option" onClick={onClick}>{children}</span>;
}

export function Select(props) {
    const {
        children,
        onChange,
        label,
    } = props;

    const options = React.Children.toArray(props.children);
    const [active, setActive] = useState(options[0].props.children);
    const [opened, setOpened] = useState(false);

    return <div className="default-select__wrapper">
        <span className="select-label">{label}</span>
        <div className={classNames({"default-select": true, "default-select_opened": opened})} onClick={() => setOpened(!opened)}>
            <span>{active}</span>
        </div>
        <div className={classNames({"select-options": true, "select-options_hidden": !opened})}>
            {
                options.map((option) => {
                    return <Option onClick={() => {setActive(option.props.children); setOpened(false);}}>{option.props.children}</Option>
                })
            }
        </div>
    </div>
}