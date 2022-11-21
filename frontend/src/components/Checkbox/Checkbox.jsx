import { useState } from "react"
import "./Checkbox.css"

export function Checkbox(props) {
    const [state, setState] = useState(false);

    const onClick = () => {   
        const newState = !state;     
        setState(newState);

        if (props.onChange) {
            props.onChange(newState);
        }
    };

    return <div className="checkbox-group">
        <input type="checkbox" onClick={onClick}/>
        <span>{ props.children }</span>
    </div>
}