import {useRef, useState} from "react";
import "./TasksEditPage.css";
import classNames from "classnames";
import {Button} from "../../components/Button/Button";
import {TaskView} from "../../components/TaskView/TaskView";
import {Popup} from "../../components/Popup/Popup";
import {createBaseQuestion} from "../../components/TaskView/taskUtils";
import {replaceObject} from "../../utils";

export function TasksEditPage(props) {
    const {
        test
    } = props;
    const [activeTask, _setActiveTask] = useState(0);
    const [tasks, setTasks] = useState(test.tasks);
    const [elementSelectorOpened, setElementSelectorOpened] = useState(false);
    const [elementListOpened, setElementListOpened] = useState(false);
    const [elementEditorOpened, setElementEditorOpened] = useState(false);
    const [editingElementName, setEditingElementName] = useState("");

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
        setElementListOpened(true);
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
                <Button style="secondary">Редактировать элемент</Button>
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
                label="Редактировать эелемент"
                className="element-editor"
            >
                {
                    (() => {
                        if (tasks[activeTask] === undefined) {
                            return null;
                        }

                        return tasks[activeTask].elements.map(el => {
                            return <span onClick={() => {
                                setElementEditorOpened(true);
                                setEditingElementName(el.name);
                            }}></span>
                        })
                    })()
                }
            </Popup>
        </div>
    </div>
}

function insertIntoText(text, s, e, v) {
    return text.slice(0, s) + v + text.slice(e, text.length);
}