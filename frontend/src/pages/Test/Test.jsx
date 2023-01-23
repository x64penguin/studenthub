import "./Test.css";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {Loading} from "../../components/Loading/Loading";
import {api_get} from "../../utils";
import {useSelector} from "react-redux";
import {selectUserAuthenticated} from "../../store/User/selectors";
import {Button} from "../../components/Button/Button";
import classNames from "classnames";

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