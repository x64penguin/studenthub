import { useState } from "react"
import "./Checkbox.css"

export function Checkbox(props) {
    const [state, setState] = useState(false);

    const onClick = () => {        
        setState(!state);
        console.log(!state);

        if (props.onChange) {
            props.onChange(!state);
        }
    };

    return <div className="checkbox-group">
        <input type="checkbox" onClick={onClick}/>
        <span>{ props.children }</span>
    </div>
}