import {useRef, useState} from "react";
import "./TasksEditPage.css";
import classNames from "classnames";
import {Button} from "../../components/Button/Button";
import {TaskView} from "../../components/TaskView/TaskView";
import {Popup} from "../../components/Popup/Popup";
import {createBaseQuestion, formatTask, generateTask, replaceQuestion} from "../../components/TaskView/taskUtils";
import {api_post, jsonify, replaceObject} from "../../utils";
import {Input} from "../../components/Input/Input";
import {Checkbox} from "../../components/Checkbox/Checkbox";
import delete_icon from "./delete-icon.svg";
import {SelectTask} from "../../components/TaskView/Select";
import {ReorderTask} from "../../components/TaskView/Reorder";
import {ConnectTask} from "../../components/TaskView/Connect";

export function TasksEditPage({test}) {
    const [activeTask, _setActiveTask] = useState(0);
    const [tasks, setTasks] = useState(test.tasks.map(formatTask));
    const [openState, setOpenState] = useState({
        selector: false,
        list: false,
        editor: false
    });
    const [editingElement, setEditingElement] = useState(undefined);

    const [textAreaValue, setTextAreaValue] = useState(tasks[0].text);
    const textAreaRef = useRef(null);

    const setActiveTask = (tid) => {
        _setActiveTask(tid);
        setTextAreaValue(tasks[tid].text);
    }

    const insertNewElement = (el) => {
        const textArea = textAreaRef.current;
        let newTextAreaValue = insertIntoText(
            textArea.value,
            textArea.selectionStart,
            textArea.selectionEnd,
            "$[" + el.name + "]"
        );
        setTextAreaValue(newTextAreaValue);
        replaceObject(tasks, setTasks, activeTask, {
            elements: [...tasks[activeTask].elements, el], text: newTextAreaValue
        });
        setEditingElement(el);
        setOpenState({...openState, selector: false, editor: true});
    }

    const QuestionElement = ({label}) => {
        return <span
            className="question-element-selector"
            onClick={() => insertNewElement(createBaseQuestion(label))}
        >
            {label}
        </span>
    }

    return <div className="tasks-edit-page">
        <div className="task-bar mx-a">
            {
                tasks.map((task, idx) => {
                    return <button
                        className={classNames({
                            "task-selector_edit": true,
                            "active": idx === activeTask
                        })}
                        onClick={() => setActiveTask(idx)}
                        key={idx}
                    >
                        {idx + 1}
                    </button>
                })
            }
            <button
                className={classNames({
                    "task-selector_edit": true,
                    "active": tasks.length === activeTask
                })}
                onClick={() => {
                    const newTaskId = tasks.length;
                    setTasks([...tasks, {
                        text: "",
                        elements: [],
                    }]);
                    _setActiveTask(newTaskId);
                    setTextAreaValue("");
                }}>+
            </button>
        </div>
        <div className="task-edit__form">
            <textarea
                ref={textAreaRef}
                value={textAreaValue}
                placeholder={"Текст задания"}
                onChange={e => {
                    setTextAreaValue(e.target.value);
                    replaceObject(tasks, setTasks, activeTask, {
                        ...tasks[activeTask], text: e.target.value
                    });
                }}
                className="input-default main-task-area"
            />
            <div className="task-preview">
                <h3>Предпросмотр</h3>
                <TaskView task={tasks[activeTask] && generateTask(tasks[activeTask])} onChange={() => {}}/>
            </div>
            <div className="buttons-row">
                <Button style="secondary" onClick={() => setOpenState({...openState, selector: true})}>Добавить вопрос</Button>
                <Button style="secondary" onClick={() => setOpenState({...openState, list: true})}>Редактировать вопрос</Button>
                <Button style="secondary" onClick={() => {
                    if (tasks.length > 0) {
                        let newTasks = [];
                        tasks.forEach((t, idx) => {
                            if (idx !== activeTask) {
                                newTasks.push(t);
                            }
                        });
                        if (tasks.length === 1) {
                            newTasks.push({text: "", elements: []});
                            setTasks(newTasks);
                            setActiveTask(0);
                            return;
                        }
                        setTasks(newTasks);
                        setActiveTask(activeTask-1);
                    }
                }}>Удалить</Button>
                <Button onClick={() =>
                    api_post("upload_tasks/" + test.id, jsonify(tasks.map(generateTask)))}>
                    Сохранить
                </Button>
            </div>
            <Popup
                opened={openState.selector}
                onClose={() => setOpenState({...openState, selector: false})}
                label="Добавить вопрос"
                className="element-selector"
            >
                <QuestionElement label="Ввод"/>
                <QuestionElement label="Выбор"/>
                <QuestionElement label="Последовательность"/>
                <QuestionElement label="Связка"/>
            </Popup>
            <Popup
                opened={openState.list}
                onClose={() => setOpenState({...openState, list: false})}
                label="Вопросы"
                className="element-editor-list"
            >
                {
                    (() => {
                        if (tasks[activeTask] === undefined) {
                            return null;
                        }

                        return tasks[activeTask].elements.map((el, idx) => {
                            return <span key={idx} onClick={() => {
                                setOpenState({...openState, editor: true, list: false});
                                setEditingElement(el);
                            }}>{el.name}</span>
                        })
                    })()
                }
            </Popup>
            <Popup
                opened={openState.editor}
                onClose={() => setOpenState({...openState, editor: false})}
                label="Редактировать вопрос"
                className="element-editor"
            >
                { openState.editor &&
                <ElementEditor
                    element={editingElement}
                    validator={e => {
                        if (e === editingElement.name) {
                            return false;
                        }

                        let result = false;
                        tasks[activeTask].elements.forEach(el => {
                            if (el.name === e) {
                                result = true;
                            }
                        });
                        return result;
                    }}
                    onSave={(newElement) => {
                        setOpenState({...openState, editor: false});
                        let newTextAreaValue = textAreaValue.replace(`$[${editingElement.name}]`, `$$[${newElement.name}]`);
                        setTextAreaValue(newTextAreaValue);
                        replaceObject(tasks, setTasks, activeTask, {
                            ...tasks[activeTask],
                            text: newTextAreaValue,
                            elements: replaceQuestion(tasks[activeTask].elements, editingElement.name, newElement)
                        });
                    }}
                /> }
            </Popup>
        </div>
    </div>
}

function VariantAdder({variants, onAdd, onDelete}) {
    const [variantName, setVariantName] = useState("");

    if (variants === undefined) {
        return null;
    }

    const VariantCard = ({children}) => {
        return <div className="variant-card">
            <span>{children}</span>
            <Button className="variant-delete" onClick={() => onDelete(children)}><img src={delete_icon} alt="delete"/></Button>
        </div>
    }

    return <div className="variant_adder">
        {
            variants.map((variant, idx) => {
                return <VariantCard key={idx}>{variant}</VariantCard>
            })
        }
        <Input
            className="variant_name_inp"
            invalid={variants.indexOf(variantName) !== -1}
            onChange={(e) => setVariantName(e.target.value)}
        />
        <Button style="secondary" onClick={() => onAdd(variantName)} className="w-100">+ Добавить вариант</Button>
    </div>
}

function ElementEditor({ element, onSave, validator }) {
    const [editedElement, setEditedElement] = useState(element);
    const [connectRight, setConnectRight] = useState(element.right);

    if (!element) {
        return null;
    }

    const nameEdit = <Input
        label="Название"
        key="label"
        placeholder="Название элемента (носит служебный характер)"
        invalid={validator(editedElement.name)}
        value={element.name}
        onChange={e => setEditedElement({...editedElement, name: e.target.value})}
    />;

    const result = [nameEdit];

    switch (element.qtype) {
        case "input":
            result.push(<Checkbox
                key="inline-mode"
                defaultValue={element.inline}
                onChange={e => setEditedElement({...editedElement, inline: e})}
            >
                Внутристрочный (вставка слова)
            </Checkbox>);
            result.push(<Checkbox
                key="int-input"
                defaultValue={element.int}
                onChange={newValue => setEditedElement({...editedElement, int: newValue})}
            >
                Число
            </Checkbox>);
            result.push(<Input
                key="right-answer"
                label="Правильный ответ"
                value={element.right}
                onChange={e => setEditedElement({...editedElement, right: e.target.value})}
            />);
            break;
        case "select":
            result.push(<Checkbox
                key="multiple"
                onChange={e => setEditedElement({...editedElement, multiselect: e})}>
                Множественный выбор
            </Checkbox>);
            result.push(<VariantAdder
                key="variant-adder"
                variants={editedElement.variants}
                onAdd={variant => setEditedElement({...editedElement, variants: [...editedElement.variants, variant]})}
                onDelete={variant => {
                    setEditedElement({...editedElement, variants: editedElement.variants.filter(vr => vr !== variant)});
                }}
            />);
            result.push(<SelectTask
                key="right-selector"
                className="element-editor__select-preview"
                element={editedElement}
                onChange={(newRight) => {
                    Object.keys(newRight).forEach(key => {
                        if (newRight[key] === false) {
                            delete newRight[key];
                        }
                    });
                    setEditedElement({...editedElement, right: newRight});
                }}
            />);
            break;
        case "order":
            result.push(<VariantAdder
                key="variant-adder"
                variants={editedElement.variants}
                onAdd={variant => setEditedElement({...editedElement, variants: [...editedElement.variants, variant], right: [...editedElement.right, variant]})}
                onDelete={variant => {
                    setEditedElement({...editedElement,
                        variants: editedElement.variants.filter(vr => vr !== variant),
                        right: editedElement.right.filter(vr => vr !== variant)
                    });
                }}
            />);
            result.push(<ReorderTask
                key="reorder-task"
                variants={editedElement.right}
                onChange={nv => setEditedElement({...editedElement, right: nv})}
            />);
            break;
        case "connect":
            result.push(<h2 key="element-label" className="element-label">Выбор из</h2>);
            result.push(<VariantAdder
                key="variant-adder-l"
                variants={editedElement.variants_l}
                onAdd={variant => {
                    setEditedElement({...editedElement, variants_l: [...editedElement.variants_l, variant]});
                    setConnectRight([[...connectRight[0], variant], connectRight[1]]);
                }}
                onDelete={variant => {
                    setEditedElement({...editedElement, variants_l: editedElement.variants_l.filter(vr => vr !== variant)});
                    let newRightAnswer = {};
                    for (const [idx, vr] in connectRight[1].entries()) {
                        if (variant !== vr) {
                            newRightAnswer[idx] = vr;
                        }
                    }
                    setConnectRight([
                        connectRight[0].filter(vr => vr !== variant),
                        newRightAnswer
                    ]);
                }}
            />);

            result.push(<h2 key="element-label2" className="element-label">Выбор в</h2>);
            result.push(<VariantAdder
                key="variant-adder-r"
                variants={editedElement.variants_r}
                onAdd={variant => {
                    setEditedElement({...editedElement, variants_r: [...editedElement.variants_r, variant]});
                    setConnectRight([connectRight[0], {...connectRight[1], [variant]: []}]);
                }}
                onDelete={variant => {
                    setEditedElement({...editedElement, variants_r: editedElement.variants_r.filter(vr => vr !== variant)})
                    let newRightAnswer = {};
                    for (const [idx, vr] in connectRight[1].entries()) {
                        if (variant !== idx) {
                            newRightAnswer[idx] = vr;
                        }
                    }
                    setConnectRight([
                        connectRight[0].filter(vr => vr !== variant),
                        newRightAnswer
                    ]);
                }}
            />);
            result.push(<ConnectTask key="connect-task" answer={connectRight} onChange={setConnectRight}/>);
            break;
        default:
            break;
    }

    result.push(<Button
        key="save-btn"
        onClick={() => {
            if (editedElement.qtype === "connect") {
                return onSave({...editedElement, right: connectRight});
            }
            onSave(editedElement);
        }}
        >Сохранить
    </Button>);
    return result;
}

function insertIntoText(text, s, e, v) {
    return text.slice(0, s) + v + text.slice(e, text.length);
}