import { useState } from "react"
import { Button } from "../../components/Button/Button"
import { Input } from "../../components/Input/Input"
import { ServerError } from "../../components/ServerError/ServerError"
import { jsonify } from "../../utils"
import { useDispatch } from "react-redux";
import "./Login.css"
import { userSlice } from "../../store/User"
import { useNavigate, useSearchParams } from "react-router-dom"
import {API_SERVER} from "../../config";

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [ searchParams ] = useSearchParams();

    const onSubmit = (event) => {
        event.preventDefault();

        const request = {
            "username": username,
            "password": password,
        }

        fetch(API_SERVER + "/api/login", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",

            },
            body: jsonify(request)
        }).then((data) => data.json()).then((data) => {
            if (data.response === "success") {
                dispatch(userSlice.actions.login(data));


                return navigate(searchParams.get("redirect") || "/");
            } else {
                setServerError(data.response);
            }
        })
    }

    return <div className="block-default login__wrapper">
        <form onSubmit={onSubmit}>
            <h1 className="form-label">Авторизация</h1>
            <Input autocomplete="username" label="Имя пользователя" onChange={(event) => setUsername(event.target.value)}/>
            <Input autocomplete="current-password" label="Пароль" type="password" onChange={(event) => setPassword(event.target.value)}/>
            <ServerError error={serverError}/>
            <Button type="submit">Войти</Button>
        </form>
    </div>
}