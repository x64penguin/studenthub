import classNames from "classnames";
import { useState } from "react";
import { Children as reactChildren } from "react";
import "./TabSwitch.css";

export function TabLabel({ onClick, children, active, style }) {
    const classes = classNames({
        controls: true,
        "tab-switch__label": true,
        "secondary": style == "secondary",
        active: active,
    });
    return (
        <span onClick={onClick} className={classes}>
            {children}
        </span>
    );
}

export function TabSwitch(props) {
    const { children, onChange, mode = "vertical", style="primary", className = "" } = props;

    const tabs = reactChildren.toArray(children);
    const [active, setActive] = useState(tabs[0].props.children);

    const classes = classNames({
        "block-default": true,
        "tab-switch": true,
        "horizontal": mode == "horizontal",
        "secondary": style == "secondary"
    });

    return (
        <div className={classes + " " + className}>
            {tabs.map((tab, index) => {
                return (
                    <TabLabel
                        key={index}
                        style={style}
                        active={tab.props.children == active}
                        onClick={() => {
                            const newActive= tab.props.children;
                            setActive(newActive);
                            onChange(newActive);
                        }}
                    >
                        {tab.props.children}
                    </TabLabel>
                );
            })}
        </div>
    );
}


export function cnTab(active) {
    return classNames({
        "tab-content": true,
        "hidden": !active
    })
}