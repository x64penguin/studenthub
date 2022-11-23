import { useState } from "react"
import { Button } from "../../components/Button/Button"
import { Input } from "../../components/Input/Input"
import { ServerError } from "../../components/ServerError/ServerError"
import { api_post} from "../../utils"
import { useDispatch } from "react-redux";
import "./Login.css"
import { userSlice } from "../../store/User"
import { useNavigate, useParams } from "react-router-dom"

export function Login(props) { 
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverError, setServerError] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const onSubmit = (event) => {
        event.preventDefault();

        const request = {
            "username": username,
            "password": password,
        }

        api_post("login", request, (data) => {
            if (data.response == "success") {
            dispatch(userSlice.actions.login(data));

                return navigate(params.redirect || "/");
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
            <ServerError error={serverError}/>
            <Button type="submit">Войти</Button>
        </form>
    </div>
}