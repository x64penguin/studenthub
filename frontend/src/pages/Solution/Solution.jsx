import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api_get, api_post} from "../../utils";
import {Loading} from "../../components/Loading/Loading";
import "./Solution.css";
import classNames from "classnames";
import {TaskView} from "../../components/TaskView/TaskView";
import {Button} from "../../components/Button/Button";
import {ProgressBar} from "../../components/ProgressBar/ProgressBar";

export function Solution() {
    const navigate = useNavigate();
    const {solutionId} = useParams();
    const [solution, setSolution] = useState(null);
    const [answer, setAnswer] = useState({});

    useEffect(() => {
        api_get("solution/" + solutionId, setSolution, () => {
           navigate("/404");
        });
    }, []);

    if (solution === null) {
        return <Loading/>;
    }

    console.log(solution);

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
                        {
                            "id": solution.current_task,
                            "answer": null,
                            "skip": true
                        },
                        (data) => {
                            setSolution(data);
                            setAnswer({});
                        }
                    );
                }}>Пропустить</Button>
                <Button onClick={() => {
                    api_post(
                        "submit_solution/" + solutionId,
                        {
                            "id": solution.current_task,
                            "answer": answer,
                            "skip": false
                        },
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
        const percentage = Math.round(solution.result[0]/solution.result[1]*100);
        return <div className="solution-page block-default">
            <h2 style={{marginTop: 0}}>{solution.test}</h2>
            <h4>Ваш результат: {solution.result[0]} баллов из {solution.result[1]} ({percentage}%)</h4>
            <ProgressBar percentage={percentage}/>
        </div>;
    }
}