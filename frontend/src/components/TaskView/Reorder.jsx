import {Reorder} from "framer-motion";
import "./Reorder.css";

export function ReorderTask({variants, onChange}) {
    return <Reorder.Group
        className="reorder-task"
        onReorder={onChange}
        values={variants}
        whileDrag={{
            boxShadow: "0 0 6px rgba(0,0,0,0.2)",
        }}
        axis="y"
    >
        {
            variants.map(v => <Reorder.Item
                key={v}
                value={v}
                className="reorder__item"
            >
                {v}
            </Reorder.Item>)
        }
    </Reorder.Group>
}