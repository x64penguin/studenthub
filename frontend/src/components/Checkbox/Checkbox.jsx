import "./Checkbox.css"

export function Checkbox(props) {
    return <div className="checkbox-group">
        <input type="checkbox"/>
        <span>{ props.children }</span>
    </div>
}