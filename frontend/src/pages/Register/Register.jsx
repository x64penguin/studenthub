import { useState } from "react";
import { ButtonFilled } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Option, Select } from "../../components/Select/Select";
import { api_get, api_post, async_api_post } from "../../utils";
import { useNavigate } from "react-router-dom";
import "./Register.css"
import { ServerError } from "../../components/ServerError/ServerError";

export function Register(props) {
    const [form, setForm] = useState({
        "username": '',
        "name": '',
        "email": '',
        "password": '',
        "confirm-password": '',
        "account-type": 0,
    });
    const [usernameValid, setUsernameValid] = useState(true);
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();

    async function onSubmit(event) {
        event.preventDefault();

        let usernameValidatedResponse = await async_api_post("validate_username", {
            username: form.username
        })

        let usernameValidated = await usernameValidatedResponse.json();

        setUsernameValid(usernameValidated.response);

        if (!usernameValidated.response) {
            return;
        }

        let registerResponse = await async_api_post("register", form);

        let registerData = await registerResponse.json();

        if (registerData.response == "success") {
            return navigate("/login");
        } else {
            setServerError(registerData.response);
        }
    }

    return <div className="block-default register-form__wrapper">
        <form onSubmit={onSubmit}>
            <h1 className="form-label">Регистрация</h1>
            <Input label="Логин" onChange={(event) => setForm({...form, username: event.target.value})} invalid={!usernameValid}/>
            <Input label="Имя, фамилия" onChange={(event) => setForm({...form, name: event.target.value})}/>
            <Input label="Электронная почта" onChange={(event) => setForm({...form, email: event.target.value})} invalid={form.email.search("@") == -1}/>
            <Input label="Пароль" onChange={(event) => setForm({...form, password: event.target.value})} type="password" invalid={form.password.length < 6}/>
            <Input label="Повторите пароль" onChange={(event) => setForm({... form, "confirm-password": event.target.value})} type="password" invalid={form.password != form["confirm-password"]}/>
            <Select label="Тип аккаунта" onChange={(id) => setForm({...form, "account-type": id})}>
                <Option>Ученик</Option>
                <Option>Учитель</Option>
            </Select>
            <ServerError error={serverError}/>
            <ButtonFilled>Зрегистрироваться</ButtonFilled>
        </form>
    </div>
}