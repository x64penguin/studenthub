import "./Connect.css";
import {useState} from "react";


export function ConnectTask({answer, onChange}) {
    const [draggingVariant, setDraggingVariant] = useState('');
    const [dragOverCard, setDragOverCard] = useState('');

    return <div className="mt-d">
        <div
            onDrop={(event) => {
                event.preventDefault();
                let newUnusedArray = answer[0];
                if (newUnusedArray.indexOf(draggingVariant) === -1) {
                    newUnusedArray = [...answer[0], draggingVariant];
                }
                let newRightAnswer = {};
                Object.entries(answer[1]).map(entry => {
                    newRightAnswer[entry[0]] = entry[1].filter(vr => vr !== draggingVariant);
                });
                onChange([newUnusedArray, newRightAnswer]);
            }}
            onDragOver={(event) => {
                event.preventDefault();
            }}
            className="connect-variants"
        >
            {
                answer[0].map((variant, idx) => <div
                    key={idx}
                    className="connect-variant"
                    draggable={true}
                    onDragStart={e => setDraggingVariant(variant)}
                >
                    {variant}
                </div>)
            }
        </div>
        <div className="mt-1">
            {
                Object.entries(answer[1]).map(entry => {
                    return <div
                        className="connect-to-variant"
                        style={{boxShadow: dragOverCard === entry[0] ? '0 0 24px #3c52b455': 'none'}}
                        onDragOver={(event) => {
                            event.preventDefault();
                            setDragOverCard(entry[1]);
                        }}
                        onDragLeave={(event) => {
                            setDragOverCard(null);
                        }}
                        onDrop={(event) => {
                            event.preventDefault();
                            setDragOverCard(null);
                            let newRightAnswer = {};
                            Object.entries(answer[1]).map(ventry => {
                                if (entry[0] === ventry[0]) {
                                    newRightAnswer[ventry[0]] = [...ventry[1], draggingVariant];
                                } else {
                                    newRightAnswer[ventry[0]] = ventry[1].filter(vr => vr !== draggingVariant);
                                }
                            });
                            onChange([answer[0].filter(vr => vr !== draggingVariant), newRightAnswer]);
                        }}
                    >
                        <span className="connect-to-label">{entry[0]}</span>
                        <div className="connect-to-container">{
                            entry[1].map((variant, idx) => <span
                                key={idx}
                                className="connect-variant"
                                draggable={true}
                                onDragStart={e => setDraggingVariant(variant)}
                            >
                                {variant}
                            </span>)
                        }</div>
                    </div>
                })
            }
        </div>
    </div>
}