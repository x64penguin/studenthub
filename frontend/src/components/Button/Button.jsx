import "./Button.css"

export function ButtonFilled(props) {
    return <button className={props.className + " button-filled"} onClick={props.onClick}>
        {props.children}
    </button>
}