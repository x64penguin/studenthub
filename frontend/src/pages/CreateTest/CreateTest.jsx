import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { FileInput } from "../../components/FileInput/FileInput";
import { Input } from "../../components/Input/Input";
import { API_SERVER } from "../../config";
import { selectUser, selectUserAuthenticated } from "../../store/User/selectors";
import "./CreateTest.css";

export function CreateTest() {
    const currentUser = useSelector(selectUser);
    const authenticated = useSelector(selectUserAuthenticated);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticated || currentUser.account_type == 0) {
            navigate("/login?redirect=/create");
        }
    }, []);

    const [ form, setForm ] = useState({
        name: "",
        description: "",
        avatar: null
    });

    const onSubmit = () => {
        let formData = new FormData;
        formData.append("name", form.name);
        formData.append("description", form.description);
        formData.append("avatar", form.avatar);

        fetch(`${API_SERVER}/api/create_test`, {
            method: "POST",
            body: formData
        }).then(resp => resp.json()).then((data) => navigate("/edit/" + data.test))
    }

    return <div className="block-default create-test">
        <h1 className="form-label">Создать тест</h1>
        <Input 
            className="test__name" 
            label="Название"
            onChange={e => setForm({...form, name: e.target.value})}
        />
        <Input 
            className="test__description" 
            label="Описание"
            onChange={e => setForm({...form, description: e.target.value})}
        />
        <FileInput label="Обложка" onChange={e => setForm({...form, avatar: e.target.files[0]})}/>
        <Button className="submit" onClick={onSubmit}>Создать</Button>
    </div>
}