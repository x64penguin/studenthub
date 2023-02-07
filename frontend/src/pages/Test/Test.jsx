import "./Test.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Loading} from "../../components/Loading/Loading";
import {api_get} from "../../utils";
import {useSelector} from "react-redux";
import {selectUserAuthenticated} from "../../store/User/selectors";
import {Button} from "../../components/Button/Button";
import classNames from "classnames";
import {CircularProgressbar} from "react-circular-progressbar";

export function TestPage() {
    const {testId} = useParams();
    const navigate = useNavigate();
    const userAuth = useSelector(selectUserAuthenticated);
    const [startedTest, setStartedTest] = useState(null);
    const [test, setTest] = useState(null);

    useEffect(() => {
        api_get("test/" + testId, (data) => {
            setTest(data);
            document.title = data.name;
        }, () => navigate("/404"));
    }, []);

    if (!test) {
        return <Loading/>;
    }

    return <>
        <div className="block-default test__page">
            <h1 className="test__title">{test.name}</h1>
            <span>{test.description}</span>
            <div className="start-test_block">
                { userAuth ?
                    <Button className="start-test" onClick={() => {
                        api_get("start_test/" + testId, (data) => {
                           if (data.response === "already started") {
                               setStartedTest(data);
                           } else {
                               navigate("/solution/" + data.id);
                           }
                        });
                    }}>Начать тест</Button> :
                    <span>Необходимо войти, чтобы начать тест</span>
                }
            </div>
        </div>
        <Result test={test}/>
        <div
            className={classNames({
                "block-default": true,
                "already-started-alert": true,
                "alert_hidden": startedTest === null
            })}
        >
            <span>У вас есть незаконченный тест: {startedTest && startedTest.name}</span>
            <div>
                <Button style="secondary">Завершить</Button>
                <Button style="secondary" onClick={() => navigate("/solution/" + startedTest.id)}>Продолжить</Button>
            </div>
        </div>
    </>;
}

function Result({test}) {
    const navigate = useNavigate();

    if (!test || !test.solutions || test.solutions.length === 0) {
        return null;
    }

    let bestSolution = test.solutions[0];
    const lastSolution = test.solutions[test.solutions.length - 1];
    const lastSolutionPercentage = Math.round(lastSolution.result[0]/lastSolution.result[1]*100);
    let bestSolutionPercentage = 0;

    for (let i = 0; i < test.solutions.length; i++) {
        const solution = test.solutions[i];
        if (solution.state === "complete" && solution.result[0] > bestSolution.result[0]) {
            bestSolution = solution;
            bestSolutionPercentage = Math.round(bestSolution.result[0]/bestSolution.result[1]*100)
        }
    }

    return <div className="result__wrapper">
        <div className="selected_results">
            <div className="result-block">
                <div>
                    <h3>Последний результат</h3>
                    <span
                        style={{
                            display: "block",
                            color: "#ffffffa0",
                            marginTop: "1rem",
                        }}
                    >Время: {lastSolution.delta}</span>
                </div>
                <CircleBar percentage={lastSolutionPercentage}/>
            </div>
            <div className="result-block">
                <div>
                    <h3>Лучший результат</h3>
                    <span
                        style={{
                            display: "block",
                            color: "#ffffffa0",
                            marginTop: "1rem",
                        }}
                    >Время: {bestSolution.delta}</span>
                </div>
                <CircleBar percentage={bestSolutionPercentage}/>
            </div>
        </div>
    </div>
}

function CircleBar({percentage}) {
    return <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        strokeWidth={16}
        styles={{
            root: {
                width: "6rem",
                marginLeft: "auto"
            },
            path: {
                stroke: "#fffffff0",
            },
            trail: {
                stroke: "#0080ff"
            },
            text: {
                fill: "#fffffff0"
            }
        }}
    />
}