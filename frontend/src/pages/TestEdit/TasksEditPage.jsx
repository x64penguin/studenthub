import {createRef, useState} from "react";
import "./TasksEditPage.css";
import classNames from "classnames";
import {Button} from "../../components/Button/Button";
import {TaskView} from "../../components/TaskView/TaskView";
import {Popup} from "../../components/Popup/Popup";

export function TasksEditPage(props) {
    const {
        test
    } = props;
    const [activeTask, setActiveTask] = useState(0);
    const [tasks, setTasks] = useState(test.tasks);
    const [newTask, setNewTask] = useState([]);
    const [elementSelectorOpened, setElementSelectorOpened] = useState(false);

    const taskAreaRef = createRef();

    if (activeTask > tasks.length) {
        setActiveTask(tasks.length);
    }

    const insertNewElement = (el) => {
        let taskArea = taskAreaRef.current;
        taskArea.value = insertIntoText(
            taskArea.value,
            taskArea.selectionStart,
            taskArea.selectionEnd,
            "$[insert]"
        );
    }

    const QuestionElement = (props) => {
        const {
            label,
            onClick
        } = props;

        return <>
            <span className="question-element-selector" onClick={onClick}>{label}</span>
        </>;
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
                        onClick={() => setActiveTask(idx)}>
                        idx
                    </button>
                })
            }
            <button className={classNames({
                "task-selector_edit": true,
                "active": tasks.length === activeTask
            })}>+</button>
        </div>
        <div className="task-edit__form">
            <textarea
                ref={taskAreaRef}
                className="input-default main-task-area"
            />
            <div className="buttons-row">
                <Button style="secondary" onClick={() => setElementSelectorOpened(true)}>Добавить элемент</Button>
                <Button style="secondary">Редактировать элемент</Button>
                <Button>Создать задание</Button>
            </div>
            <div className="task-preview">
                <TaskView/>
            </div>
            <Popup
                opened={elementSelectorOpened}
                onClose={() => setElementSelectorOpened(false)}
                label="Добавить элемент"
                className="element-selector">
                <QuestionElement label="Ввод"/>
                <QuestionElement label="Выбор"/>
                <QuestionElement label="Последовательность"/>
                <QuestionElement label="Связка"/>
                <QuestionElement label="Внутристрочный ввод"/>
                <QuestionElement label="Внутристрочный выбор"/>
            </Popup>
        </div>
    </div>
}

function insertIntoText(text, s, e, v) {
    return text.slice(0, s) + v + text.slice(e, text.length);
}