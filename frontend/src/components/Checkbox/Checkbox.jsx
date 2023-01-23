import { useState } from "react"
import "./Checkbox.css"

export function Checkbox({onChange, defaultValue = false, children}) {
    const [state, setState] = useState(defaultValue);

    const onClick = () => {   
        const newState = !state;     
        setState(newState);

        if (onChange) {
            onChange(newState);
        }
    };

    return <div className="checkbox-group">
        <input type="checkbox" onChange={onClick} checked={state}/>
        <span>{ children }</span>
    </div>
}