import "./SquareButton.css"

export function SquareButton({
        children,
        className = "",
        onClick
    }) {

    return <button className={"controls square-button " + className} onClick={onClick}>
        { children }
    </button>
}