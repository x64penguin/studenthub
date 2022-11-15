import { useState } from "react";
import { ButtonFilled } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Option, Select } from "../../components/Select/Select";
import { api_get, api_post, async_api_post } from "../../utils";
import { useNavigate } from "react-router-dom";
import "./Register.css"
import { ServerError } from "../../components/ServerError/ServerError";

export function Register(props) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('');
    const [usernameValid, setUsernameValid] = useState(true);
    const [serverError, setServerError] = useState('');

    const navigate = useNavigate();

    // const validateAndSubmit = () => {
    //     if (!usernameValid || password != confirmPassword || email.search('@') == -1) {
    //         return;
    //     }

    //     api_post("register", {"username": username, "email": email, "name": name, "account-type": accountType, "password": password}, (data) => {
    //         navigate("/login");
    //     }, (data) => setServerError(data.response));
    // }

    async function onSubmit(event) {
        event.preventDefault();

        let usernameValidatedResponse = await async_api_post("validate_username", {
            username: username
        })

        let usernameValidated = await usernameValidatedResponse.json();

        setUsernameValid(usernameValidated.response);

        if (!usernameValidated.response) {
            return;
        }

        let registerResponse = await async_api_post("register", {
            "username": username,
            "email": email,
            "name": name,
            "account-type": accountType,
            "password": password,
        });

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
            <Input label="Логин" onChange={(event) => setUsername(event.target.value)} invalid={!usernameValid}/>
            <Input label="Имя, фамилия" onChange={(event) => setName(event.target.value)}/>
            <Input label="Электронная почта" onChange={(event) => setEmail(event.target.value)} invalid={email.search("@") == -1}/>
            <Input label="Пароль" onChange={(event) => setPassword(event.target.value)} type="password" invalid={password.length < 6}/>
            <Input label="Повторите пароль" onChange={(event) => setConfirmPassword(event.target.value)} type="password" invalid={password != confirmPassword}/>
            <Select label="Тип аккаунта" onChange={(id) => setAccountType(id)}>
                <Option>Ученик</Option>
                <Option>Учитель</Option>
            </Select>
            <ServerError error={serverError}/>
            <ButtonFilled>Зрегистрироваться</ButtonFilled>
        </form>
    </div>
}