import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../../store/User/selectors";
import { DropdownItem, Dropdown } from "../Dropdown/Dropdown";
import { Link, redirect } from "react-router-dom";
import menu_icon from "./menu.svg";
import "./Navbar.css";
import { api_get } from "../../utils";
import { userSlice } from "../../store/User";
import default_avatar from "./avatar-default.svg";


function logout(dispatch) {
    api_get("logout");
    dispatch(userSlice.actions.logout());
}

function NavMenu(props) {
    const [opened, setOpened] = useState(false);
    const user = useSelector((state) => selectUser(state));
    const dispatch = useDispatch();

    let user_authed = <>
        <DropdownItem>Профиль</DropdownItem>
        <DropdownItem>Настройки</DropdownItem>
        <DropdownItem onClick={() => logout(dispatch)}>Выйти</DropdownItem>
    </>;

    let user_unauthed = <>
        <DropdownItem link="/login">Войти</DropdownItem>
        <DropdownItem link="/register">Регистрация</DropdownItem>
    </>

    return (
        <div className="menu-dropdown__wrapper">
            <button type="button" className="menu-button" onClick={() => setOpened(!opened)}><img src={menu_icon}/></button>
            <Dropdown opened={opened}>
                <DropdownItem link="/catalog">Каталог</DropdownItem>
                <DropdownItem link="/about">О проекте</DropdownItem>
                <DropdownItem>Учителям</DropdownItem>
                <DropdownItem>Ученикам</DropdownItem>
                
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
                <img src={user.user.avatar || default_avatar}/>
            </div>

            <Dropdown opened={opened}>
                <DropdownItem link={"/user/" + user.user.id}>Профиль</DropdownItem>
                <DropdownItem>Настройки</DropdownItem>
                <DropdownItem onClick={() => logout(dispatch)}>Выйти</DropdownItem>
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