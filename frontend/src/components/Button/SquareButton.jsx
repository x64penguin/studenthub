import "./SquareButton.css"

export function SquareButton(props) {
    const {
        children,
        className = "",
        onClick
    } = props;

    return <button className={"controls square-button " + className} onClick={onClick}>
        { children }
    </button>
}