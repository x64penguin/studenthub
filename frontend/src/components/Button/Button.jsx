import "./Button.css"

export function Button({
        className="",
        onClick,
        children,
        type="button",
        style="primary"
    }) {
    return <button type={type} className={className + " controls button " + style} onClick={onClick}>
        {children}
    </button>
}