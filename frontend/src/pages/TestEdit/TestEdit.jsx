import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api_get, api_post, staticFile} from "../../utils";
import {Loading} from "../../components/Loading/Loading";
import "./TestEdit.css";
import {cnTab, TabLabel, TabSwitch} from "../../components/TabSwitch/TabSwitch";
import {Input} from "../../components/Input/Input";
import {FileInput} from "../../components/FileInput/FileInput";
import {Button} from "../../components/Button/Button";
import {TasksEditPage} from "./TasksEditPage";
import {useSelector} from "react-redux";
import {selectUser} from "../../store/User/selectors";
import {ProgressBar} from "../../components/ProgressBar/ProgressBar";

export function TestEdit() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const currentUser = useSelector(selectUser);
    const [ test, setTest ] = useState(null);
    const [ currentTab, setCurrentTab ] = useState("Основные");

    const [ form, setForm ] = useState({
        name: undefined,
        description: undefined,
        image: undefined
    });

    useEffect(() => {
        document.title = "StudentHub - редактирование теста";
        api_get("test/" + testId + "?include_tasks=true", (data) => {
            if (currentUser.id !== data.author) {
                navigate("/test/" + testId);
            }
            setTest(data);
            setForm({
                name: data.name,
                description: data.description
            });
            let groupedSolutions = {};

            data.solutions.forEach(solution => {
                if (groupedSolutions[solution.user_id]) {
                    groupedSolutions[solution.user_id] = solution;
                }
            });
        });
    }, [setTest, setForm, testId]);

    if (test === null) {
        return <Loading/>;
    }

    const changeImage = (e) => {
        setForm({...form, image: e.target.files[0]});
    }

    const saveChanges = () => {
        let formData = new FormData();
        formData.append("name", form.name);
        formData.append("description", form.description);
        if (form.image !== undefined) {
            formData.append("image", form.image);
        }

        api_post("edit_test/main", formData, () => {
            navigate("/test/" + testId);
        });
    }

    return <div className="test-edit__page">
        <div className="block-default test-edit__title">
            <img src={staticFile("test_icon/" + testId)} alt="test-icon"/>
            <Input className="test-name" value={test.name}/>
        </div>
        <div className="test-dashboard">
            <TabSwitch onChange={setCurrentTab}>
                <TabLabel>Основные</TabLabel>
                <TabLabel>Задания</TabLabel>
                <TabLabel>Результаты</TabLabel>
            </TabSwitch>
            <div className="block-default dashboard-content">
                <div className={cnTab(currentTab === "Основные")}>
                    <Input label="Описание" value={form.description}/>
                    <FileInput label="Картинка" onChange={changeImage}/>
                    <Button className="submit" onClick={saveChanges}>Сохранить</Button>
                </div>
                <div className={cnTab(currentTab === "Задания")}>
                    <TasksEditPage test={test}/>
                </div>
                <div className={cnTab(currentTab === "Результаты")}>
                    {
                        Object.entries(test.solutions).map((pair) => {
                            const [name, solutions] = pair;
                            return <SolutionInfo key={name} name={name} solutions={solutions}/>;
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}

function SolutionInfo({name, solutions}) {
    const [expanded, setExpanded] = useState(false);
    const firstSolution = solutions[0];

    if (!expanded) {
        return <div className="solution-info not-expanded" onClick={() => setExpanded(!expanded)}>
            <h2 style={{margin: 0}}>{name}</h2>
            <div className="result">
                {
                    firstSolution.state === "complete" ?
                        <>
                            <span>Первая поптыка: {Math.round(firstSolution.result[0]/firstSolution.result[1]*100)}% Время: {firstSolution.delta}</span>
                            <ProgressBar style={{marginLeft: "16px", width: "10rem"}} percentage={Math.round(firstSolution.result[0]/firstSolution.result[1]*100)}/>
                        </> :
                        <>
                            <span>Решает</span>
                        </>
                }
            </div>
        </div>;
    }

    return <div className="solution-info" onClick={() => setExpanded(!expanded)}>
        <h2 style={{margin: 0}}>{name}</h2>
        {
            solutions.map((solution, idx) => <div
                key={idx}
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
            }}>
                { solution.state === "complete" ?
                    <>
                        <span>Попытка №{idx + 1}: {Math.round(solution.result[0]/solution.result[1]*100)}% Время: {solution.delta}</span>
                        <ProgressBar style={{width: "10rem", background: "white"}}  percentage={Math.round(solution.result[0]/solution.result[1]*100)}/>
                    </>
                    :
                    <span>Решает</span>
                }
            </div>)
        }
    </div>;
}