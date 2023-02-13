import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api_get, api_post, jsonify} from "../../utils";
import {Loading} from "../../components/Loading/Loading";
import "./Solution.css";
import classNames from "classnames";
import {TaskView, TaskViewAnswers} from "../../components/TaskView/TaskView";
import {Button} from "../../components/Button/Button";
import {Option, Select} from "../../components/Select/Select";
import {LinkButton} from "../../components/Button/LinkButton";

export function Solution() {
    const navigate = useNavigate();
    const {solutionId} = useParams();
    const [solution, setSolution] = useState(null);
    const [answer, setAnswer] = useState({});

    useEffect(() => {
        api_get("solution/" + solutionId, (data) => {
            setSolution(data);
            document.title = data.test.name;
        }, () => {
           navigate("/404");
        });
    }, []);

    if (solution === null) {
        return <Loading/>;
    }

    if (solution.state !== "complete") {
        return <div className="solution-page">
            <div className="solution__task-bar">
                {
                    (() => {
                        let taskBar = [];
                        for (let task = 0; task < solution.total_tasks; task++) {
                            taskBar.push(<span className={
                                classNames({
                                    "task-bar__item": true,
                                    "active": task === solution.current_task,
                                    "answered": solution.answered.indexOf(task) !== -1,
                                    "skipped": solution.skipped.indexOf(task) !== -1
                                })}>{task + 1}
                        </span>)
                        }
                        return taskBar;
                    })()
                }
            </div>
            <TaskView className="block-default" task={solution.task} onChange={setAnswer}/>
            <div className="buttons-row_ar">
                <Button style="secondary" onClick={() => {
                    api_post(
                        "submit_solution/" + solutionId,
                        jsonify({
                            "id": solution.current_task,
                            "answer": null,
                            "skip": true
                        }),
                        (data) => {
                            setSolution(data);
                            setAnswer({});
                        }
                    );
                }}>Пропустить</Button>
                <Button onClick={() => {
                    api_post(
                        "submit_solution/" + solutionId,
                        jsonify({
                            "id": solution.current_task,
                            "answer": answer,
                            "skip": false
                        }),
                        (data) => {
                            setSolution(data);
                            setAnswer({});
                        },
                        () => {
                            navigate("/404");
                        }
                    );
                }}>Ответить</Button>
            </div>
        </div>;
    } else {
        return <SolutionResults solution={solution}/>
    }
}

function SolutionResults({solution}) {
    const [task, setTask] = useState(solution.test.tasks[0]);
    const [answerSwitch, setAnswerSwitch] = useState(0);

    function RenderBar() {
        let result = [];
        for (let i = 0; i < solution.test.tasks.length; i++) {
            result.push(<span
                className="task-bar__item answered"
                key={i}
                onClick={() => setTask(solution.test.tasks[i])}
                style={{
                    cursor: "pointer"
                }}
            >
                {i + 1}
            </span>);
        }

        return result;
    }

    const taskId = solution.test.tasks.indexOf(task);

    return <div className="solution-page">
        <div className="solution__task-bar">
            <RenderBar/>
        </div>
        <div
            className="block-default"
            style={{
                marginTop: "var(--default-margin)"
            }}
        >
            <TaskViewAnswers
                showRight={answerSwitch === 0}
                task={task}
                answers={solution.answered[taskId]}
                errors={solution.errors[taskId]}
            />
        </div>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <LinkButton css={{marginTop: "auto"}} link={"/test/" + solution.test.id}>Вернуться к тесту</LinkButton>
            <Select
                onChange={setAnswerSwitch}
            >
                <Option>Правильные ответы</Option>
                <Option>Ваши ответы</Option>
            </Select>
        </div>
    </div>;
}