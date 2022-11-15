import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { DDItem, Dropdown } from "../Dropdown/Dropdown";
import { Link, redirect } from "react-router-dom";
import menu_icon from "./menu.svg";
import "./Navbar.css";
import { api_get } from "../../utils";
import { userSlice } from "../../store/User";


function logout(dispatch) {
    api_get("logout");
    dispatch(userSlice.actions.logout());
}

function NavMenu(props) {
    const [opened, setOpened] = useState(false);
    const user = useSelector((state) => selectUser(state));
    const dispatch = useDispatch();

    let user_authed = <>
        <DDItem>Профиль</DDItem>
        <DDItem>Настройки</DDItem>
        <DDItem onClick={() => logout(dispatch)}>Выйти</DDItem>
    </>;

    let user_unauthed = <>
        <DDItem link="/login">Войти</DDItem>
        <DDItem link="/register">Регистрация</DDItem>
    </>

    return (
        <div className="menu-dropdown__wrapper">
            <button type="button" className="menu-button" onClick={() => setOpened(!opened)}><img src={menu_icon}/></button>
            <Dropdown opened={opened}>
                <DDItem link="/catalog">Каталог</DDItem>
                <DDItem link="/about">О проекте</DDItem>
                <DDItem>Учителям</DDItem>
                <DDItem>Ученикам</DDItem>
                
                { user.auth ? user_authed : user_unauthed }
            </Dropdown>
        </div>
    )
}

function Profile() {
    const [opened, setOpened] = useState(false);
    const user = useSelector((state) => selectUser(state));
    const dispatch = useDispatch();

    if (user.auth) {
        return <div className="profile__wrapper">
            <div className="profile" onClick={() => setOpened(!opened)}>
                <span className="profile__name">{user.user.username}</span>
                {/* тут автар */}
            </div>

            <Dropdown opened={opened}>
                <DDItem link={"/user/" + user.user.id}>Профиль</DDItem>
                <DDItem>Настройки</DDItem>
                <DDItem onClick={() => logout(dispatch)}>Выйти</DDItem>
            </Dropdown>
        </div>
    } else {
        return <div className="profile__wrapper">
            <Link to="/login" className="link-btn">Войти</Link>
            <Link to="/register" className="link-btn">Регистрация</Link>
        </div>
    }
}

export function Navbar() {
    return (
        <nav>
            <Link to="/" className="nav__title">studenthub</Link>
            <a className="nav__catalog">Каталог</a>
            <div className="nav__links">
                <a href="" className="link-btn">О проекте</a>
                <span className="link-btn">Учителям</span>
                <span className="link-btn">Ученикам</span>
            </div>
            <Profile/>
            <NavMenu/>
        </nav>
    )
}