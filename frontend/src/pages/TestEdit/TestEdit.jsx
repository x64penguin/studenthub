import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {api_get, api_post, staticFile} from "../../utils";
import {Loading} from "../../components/Loading/Loading";
import "./TestEdit.css"
import {cnTab, TabLabel, TabSwitch} from "../../components/TabSwitch/TabSwitch";
import {Input} from "../../components/Input/Input";
import {FileInput} from "../../components/FileInput/FileInput";
import {Button} from "../../components/Button/Button";

export function TestEdit() {
    const { testId } = useParams();
    const navigate = useNavigate();
    const [ test, setTest ] = useState(null);
    const [ currentTab, setCurrentTab ] = useState("Основные");

    const [ form, setForm ] = useState({
        name: undefined,
        description: undefined,
        image: undefined
    });

    useEffect(() => {
        api_get("test/" + testId, (data) => {
            setTest(data);
            setForm({
                name: data.name,
                description: data.description
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
            </div>
        </div>
    </div>
}