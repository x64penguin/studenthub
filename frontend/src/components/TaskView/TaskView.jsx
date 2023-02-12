import "./TaskView.css";
import {useState} from "react";
import {Input} from "../Input/Input";
import {SelectTask} from "./Select";
import {ReorderTask} from "./Reorder";
import {ConnectTask} from "./Connect";
import classNames from "classnames";

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

    return <div className={classNames("task-view", className)}>
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
                                className={element.inline ? "task-inline" : "task-view__task"}
                                onChange={(event) => {
                                    if (element.int) {
                                        event.target.value.replace(",", ".");
                                    }

                                    updateAnswers(element.name, event.target.value);
                                }}
                            />;
                        case 'select':
                            return <SelectTask
                                className="task-view__task"
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

                return null;
            })
        }
    </div>;
}

export function TaskViewAnswers({task, answers, errors, className, showRight}) {
    return <div className={className}>
        {
            task.map((element, idx) => {
                if (typeof element === 'string') {
                    return <span key={idx}>{element}</span>;
                } else {
                    switch (element.qtype) {
                        case 'input':
                            return <InputResultView
                                key={element.name}
                                inline={element.inline}
                                value={showRight ? element.right : answers[element.name]}
                                error={errors[element.name]}
                            />;
                        case 'select':
                            return <SelectResultView
                                key={element.name}
                                element={element}
                                value={showRight ? element.right : answers[element.name]}
                                error={errors[element.name]}
                            />;
                        case 'order':
                            return <ReorderResultView
                                key={element.name}
                                value={showRight ? element.right : answers[element.name]}
                                error={errors[element.name]}
                            />;
                        case 'connect':
                            return <ConnectResultView
                                key={element.name}
                                value={showRight ? element.right : answers[element.name][1]}
                                error={errors[element.name]}
                            />;
                    }
                }

                return null;
            })
        }
    </div>;
}

function InputResultView({value, error, inline}) {
    return <span
        className={classNames({
            "input-result-view": true,
            "error": error,
            "inline": inline,
        })}
    >
        {value}
    </span>;
}

function SelectResultView({element, error, value}) {
    return <div className="task-view__task">
        {
            element.variants.map((variant, idx) => {
                return <span className={classNames({
                    "select-task__variant": true,
                    "error": value[variant] && error,
                    "success": value[variant] && !error,
                })}>
                    {variant}
                </span>
            })
        }
    </div>
}

function ReorderResultView({error, value}) {
    return <div className="task-view__task">
        {
            value.map((variant, idx) => {
                return <span className={classNames({
                    "select-task__variant": true,
                    "error": error,
                    "success": !error,
                })}>
                    {variant}
                </span>
            })
        }
    </div>
}

function ConnectResultView({value, error}) {
    return <div className="mt-1">
        {
            Object.entries(value).map(entry => {
                return <div
                    className="connect-to-variant"
                >
                    <span className="connect-to-label">{entry[0]}</span>
                    <div
                        className="connect-to-container"
                        style={{
                            "background": error ? "rgb(255, 131, 131)" : "rgb(162, 255, 123)"
                        }}
                    >{
                        entry[1].map((variant, idx) => <span
                            key={idx}
                            className="connect-variant"
                        >
                                {variant}
                            </span>)
                    }</div>
                </div>
            })
        }
    </div>;
}