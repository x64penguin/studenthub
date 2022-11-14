import { useState } from "react"
import { ButtonFilled } from "../../components/Button/Button"
import { Checkbox } from "../../components/Checkbox/Checkbox"
import { Input } from "../../components/Input/Input"
import { ServerError } from "../../components/ServerError/ServerError"
import { api_post } from "../../utils"
import "./Login.css"

export function Login(props) { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState('');
    const [serverError, setServerError] = useState('');

    const onSubmit = (event) => {
        event.preventDefault();

        const request = {
            "username": username,
            "password": password,
            "remember-me": rememberMe
        }

        api_post("login_user", request, (data) => {
            const response = data.response;
            if (response == "success") {
                // TODO: redirect
            } else {
                setServerError(data.response);
            }
        })
    }

    return <div className="block-default login__wrapper">
        <form onSubmit={onSubmit}>
            <h1 className="form-label">Авторизация</h1>
            <Input label="Имя пользователя" onChange={(event) => setUsername(event.target.value)}/>
            <Input label="Пароль" type="password" onChange={(event) => setPassword(event.target.value)}/>
            <Checkbox onChange={(event) => setRememberMe(event.target.value)}>Запомнить меня</Checkbox>
            <ServerError error={serverError}/>
            <ButtonFilled>Войти</ButtonFilled>
        </form>
    </div>
}