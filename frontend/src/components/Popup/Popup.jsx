import exit from "./exit.svg";
import classNames from "classnames";
import "./Popup.css";

export function Popup(props) {
    const {
        opened,
        label,
        children,
        className,
        onClose
    } = props;

    const cn = classNames({
        "block-default": true,
        "popup": true,
        "popup_hidden": !opened
    });

    return <div className={cn + " " + className}>
        <div className="popup__header">
            <h3>{label}</h3>
            <button onClick={onClose}>
                <img src={exit}/>
            </button>
        </div>
        <div className="popup__container">
            {children}
        </div>
    </div>
}