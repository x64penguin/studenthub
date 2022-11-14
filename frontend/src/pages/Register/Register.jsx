import { useState } from "react";
import { ButtonFilled } from "../../components/Button/Button";
import { Input } from "../../components/Input/Input";
import { Option, Select } from "../../components/Select/Select";
import { api_get, api_post } from "../../utils";
import "./Register.css"

export function Register(props) {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [accountType, setAccountType] = useState('');
    const [usernameValid, setUsernameValid] = useState(true);

    const onSubmit = (event) => {
        event.preventDefault();
        api_post("validate_username", {"username": username}, (data) => {
            console.log(data.response);
            setUsernameValid(data.response);
        });
    }

    return <div className="block-default register-form__wrapper">
        <form onSubmit={onSubmit}>
            <h1 className="form-label">Регистрация</h1>
            <Input label="Логин" onChange={(event) => setUsername(event.target.value)} invalid={!usernameValid}/>
            <Input label="Имя, фамилия" onChange={(event) => setName(event.target.value)}/>
            <Input label="Электронная почта" onChange={(event) => setEmail(event.target.value)} invalid={email.search("@") != -1}/>
            <Input label="Пароль" onChange={(event) => setPassword(event.target.value)} type="password"/>
            <Input label="Повторите пароль" onChange={(event) => setConfirmPassword(event.target.value)} type="password" invalid={password != confirmPassword}/>
            <Select label="Тип аккаунта">
                <Option>Учитель</Option>
                <Option>Ученик</Option>
            </Select>
            <ButtonFilled>Зрегистрироваться</ButtonFilled>
        </form>
    </div>
}