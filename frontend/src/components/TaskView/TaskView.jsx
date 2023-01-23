import "./TaskView.css";
import {useState} from "react";
import {Input} from "../Input/Input";
import {SelectTask} from "./Select";
import {ReorderTask} from "./Reorder";
import {ConnectTask} from "./Connect";

export function TaskView(props) {
    const {
        task,
        onChange,
        className = ""
    } = props;

    const [answers, setAnswers] = useState({});

    if (!task) {
        return null;
    }

    function updateAnswers(name, answer) {
        let newAnswers = {...answers, [name]: answer};
        Object.keys(newAnswers).forEach(key => {
            if (task.find(el => el.name ===  key) === undefined) {
                delete newAnswers[key];
            }
        })
        setAnswers(newAnswers);
        onChange(newAnswers);
    }

    return <div className={"task-view " + className}>
        {
            task.map((element, idx) => {
                if (typeof element === 'string') {
                    return <span key={idx}>{element}</span>;
                } else {
                    switch (element.qtype) {
                        case 'input':
                            return <Input
                                key={element.name}
                                placeholder={element.int ? "Число" : "Строка"}
                                className={element.inline ? "task-inline" : "task"}
                                onChange={(event) => {
                                    if (element.int) {
                                        event.target.value.replace(",", ".");
                                    }

                                    updateAnswers(element.name, event.target.value);
                                }}
                            />;
                        case 'select':
                            return <SelectTask
                                className="task"
                                key={element.name}
                                element={element}
                                onChange={newValue => updateAnswers(element.name, newValue)}
                            />;
                        case 'order':
                            return <ReorderTask
                                key={element.name}
                                variants={answers[element.name] || element.variants}
                                onChange={newValue => updateAnswers(element.name, newValue)}
                            />;
                        case 'connect':
                            const initAnswer = {};
                            element.variants_r.map(v => initAnswer[v] = []);
                            return <ConnectTask
                                key={element.name}
                                answer={answers[element.name] || [element.variants_l, initAnswer]}
                                onChange={newValue => updateAnswers(element.name, newValue)}
                            />;
                    }
                }
            })
        }
    </div>;
}