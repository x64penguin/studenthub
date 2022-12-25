import {useState} from "react";
import "./Select.css";
import classNames from "classnames";

export function SelectTask({element, className, onChange}) {
    const [selectedValues, setSelectedValues] = useState(element.right);

    return <div className={className}>
        {
            element.variants.map(v => {
                return <span
                    className={classNames({"select-task__variant": true, "selected": selectedValues[v]})}
                    onClick={() => {
                        let newSelectedValues;
                        if (element.multiselect) {
                            newSelectedValues = {...selectedValues, [v]: !selectedValues[v]};
                        } else {
                            newSelectedValues = {[v]: !selectedValues[v]};
                        }

                        setSelectedValues(newSelectedValues);
                        onChange(newSelectedValues);
                    }}
                >{v}</span>
            })
        }
    </div>
}