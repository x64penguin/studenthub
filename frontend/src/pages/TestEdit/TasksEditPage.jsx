import {useRef, useState} from "react";
import "./TasksEditPage.css";
import classNames from "classnames";
import {Button} from "../../components/Button/Button";
import {TaskView} from "../../components/TaskView/TaskView";
import {Popup} from "../../components/Popup/Popup";
import {createBaseQuestion, replaceQuestion} from "../../components/TaskView/taskUtils";
import {replaceObject} from "../../utils";
import {Input} from "../../components/Input/Input";
import {Checkbox} from "../../components/Checkbox/Checkbox";
import {SquareButton} from "../../components/Button/SquareButton";
import delete_icon from "./delete-icon.svg";

export function TasksEditPage(props) {
    const {
        test
    } = props;
    const [activeTask, _setActiveTask] = useState(0);
    const [tasks, setTasks] = useState(test.tasks);
    const [elementSelectorOpened, setElementSelectorOpened] = useState(false);
    const [elementListOpened, setElementListOpened] = useState(false);
    const [elementEditorOpened, setElementEditorOpened] = useState(false);
    const [editingElement, setEditingElement] = useState(undefined);

    const [textAreaValue, setTextAreaValue] = useState("");
    const textAreaRef = useRef(null);

    const setActiveTask = (tid) => {
        _setActiveTask(tid);
        setTextAreaValue(tasks[tid].text);
    }

    const insertNewElement = (el) => {
        let textArea = textAreaRef.current;
        setTextAreaValue(insertIntoText(
            textArea.value,
            textArea.selectionStart,
            textArea.selectionEnd,
            "$[" + el.name + "]"
        ));
        replaceObject(tasks, setTasks, activeTask, {
            ...tasks[activeTask], elements: [...tasks[activeTask].elements, el]
        });
        setEditingElement(el);
        setElementSelectorOpened(false);
        setElementEditorOpened(true);
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
                        key={idx}>
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
                onChange={e => setTextAreaValue(e.target.value)}
                className="input-default main-task-area"
            />
            <div className="task-preview">
                <TaskView/>
            </div>
            <div className="buttons-row">
                <Button style="secondary" onClick={() => setElementSelectorOpened(true)}>Добавить элемент</Button>
                <Button style="secondary" onClick={() => setElementListOpened(true)}>Редактировать элемент</Button>
                <Button style="secondary">Удалить</Button>
                <Button>Сохранить</Button>
            </div>
            <Popup
                opened={elementSelectorOpened}
                onClose={() => setElementSelectorOpened(false)}
                label="Добавить элемент"
                className="element-selector"
            >
                <QuestionElement label="Ввод"/>
                <QuestionElement label="Выбор"/>
                <QuestionElement label="Последовательность"/>
                <QuestionElement label="Связка"/>
            </Popup>
            <Popup
                opened={elementListOpened}
                onClose={() => setElementListOpened(false)}
                label="Элементы"
                className="element-editor-list"
            >
                {
                    (() => {
                        if (tasks[activeTask] === undefined) {
                            return null;
                        }

                        return tasks[activeTask].elements.map(el => {
                            return <span onClick={() => {
                                setElementEditorOpened(true);
                                setElementListOpened(false);
                                setEditingElement(el);
                            }}>{el.name}</span>
                        })
                    })()
                }
            </Popup>
            <Popup
                opened={elementEditorOpened}
                onClose={() => setElementEditorOpened(false)}
                label="Редактировать элемент"
                className="element-editor"
            >
                <ElementEditor
                    element={editingElement}
                    onSave={(newElement) => {
                        setElementEditorOpened(false);
                        replaceObject(tasks, setTasks, activeTask, {
                            ...tasks[activeTask], elements: replaceQuestion(tasks[activeTask].elements, editingElement.name, newElement)
                        });
                        setTextAreaValue(textAreaValue.replace(`$[${editingElement.name}]`, `$$[${newElement.name}]`));
                    }}
                />
            </Popup>
        </div>
    </div>
}

function VariantAdder({variants, onAdd, onDelete}) {
    const [variantName, setVariantName] = useState("");

    const VariantCard = ({children}) => {
        return <div className="variant-card">
            <span>{children}</span>
            <SquareButton className="variant-delete"><img src={delete_icon} alt="delete"/></SquareButton>
        </div>
    }

    return <div className="variant_adder">
        {
            variants.map(variant => {
                return <VariantCard>{variant}</VariantCard>
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

    if (editedElement === undefined && element !== undefined) {
        setEditedElement(element);
    }

    if (editedElement === undefined || editedElement === null || element === undefined) {
        return;
    }

    const nameEdit = <Input
        label="Название"
        invalid={validator}
        value={element.name}
        onChange={e => setEditedElement({...editedElement, name: e.target.value})}
    />;

    const inlineMode = <Checkbox
        onChange={e => setEditedElement({...editedElement, inline: e})}
    >
        Внутристрочный
    </Checkbox>;

    const result = [nameEdit];

    switch (element.qtype) {
        case "input":
            result.push(inlineMode);
            result.push(<Input
                label="Правильный ответ"
                value={element.right}
                onChange={e => setEditedElement({...editedElement, right: e.target.value})}
            />);
            break;
        case "select":
            result.push(inlineMode);
            result.push(<VariantAdder
                variants={editedElement.variants}
                onAdd={variant => {setEditedElement({...editedElement, variants: [...editedElement.variants, variant]})}}
                onDelete={variant => {}}
            />);
            break;
        default:
            // TODO: make variant adder for others
            break;
    }

    result.push(<Button onClick={() => onSave(editedElement)}>Сохранить</Button>);
    return result;
}

function insertIntoText(text, s, e, v) {
    return text.slice(0, s) + v + text.slice(e, text.length);
}