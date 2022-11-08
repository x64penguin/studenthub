import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { DDItem, Dropdown } from "../Dropdown/Dropdown";
import "./Navbar.css"

function Profile() {
    const [opened, setOpened] = useState(false);
    const user = useSelector((state) => selectUser(state));

    if (user.auth) {
        return <div className="profile__wrapper">
            <div className="profile" onClick={() => setOpened(!opened)}>
                <span className="profile__name">{user.auth}</span>
                {/* тут автар */}
            </div>

            <Dropdown opened={opened}>
                <DDItem>Профиль</DDItem>
                <DDItem>Настройки</DDItem>
                <DDItem>Выйти</DDItem>
            </Dropdown>
        </div>
    } else {
        return <div className="profile__wrapper">
            <a href="/login" className="link-btn">Войти</a>
            <a href="/login" className="link-btn">Регистрация</a>
        </div>
    }
}

export function Navbar() {
    return (
        <nav>
            <a className="nav__title">studenthub</a>
            <a className="nav__catalog">Каталог</a>
            <div className="nav__links">
                <a href="" className="link-btn">О проекте</a>
                <span className="link-btn">Учителям</span>
                <span className="link-btn">Ученикам</span>
            </div>
            <Profile/>
        </nav>
    )
}