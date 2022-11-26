import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { FileInput } from "../../components/FileInput/FileInput";
import { Input } from "../../components/Input/Input";
import { selectUser, selectUserAuthenticated } from "../../store/User/selectors";
import "./CreateTest.css";

export function CreateTest() {
    const currentUser = useSelector(selectUser);
    const authenticated = useSelector(selectUserAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated) {
            navigate("/login?redirect=/create");
        }
    }, []);

    const [ form, setForm ] = useState({
        name: "",
        description: ""
    });

    return <div className="block-default create-test">
        <h1 className="form-label">Создать тест</h1>
        <Input className="test__name" label="Название"/>
        <Input className="test__description" label="Описание"/>
        <FileInput label="Обложка"/>
        <Button className="submit">Создать</Button>
    </div>
}