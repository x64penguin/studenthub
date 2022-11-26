import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, selectUserAuthenticated } from "../../store/User/selectors";
import { DropdownItem, Dropdown } from "../Dropdown/Dropdown";
import { Link, redirect } from "react-router-dom";
import menu_icon from "./menu.svg";
import "./Navbar.css";
import { api_get } from "../../utils";
import { userSlice } from "../../store/User";
import { API_SERVER } from "../../config";


function logout(dispatch) {
    api_get("logout");
    dispatch(userSlice.actions.logout());
}

function NavMenu(props) {
    const [opened, setOpened] = useState(false);
    const user = useSelector(selectUser);
    const auth = useSelector(selectUserAuthenticated);
    const dispatch = useDispatch();

    const closeMenu = () => setOpened(false);

    let userAuthed = <>
        <DropdownItem link={"/user/" + user.id}>Профиль</DropdownItem>
        <DropdownItem link={"/user/" + user.id + "/edit"}>Настройки</DropdownItem>
        <DropdownItem onClick={() => logout(dispatch)}>Выйти</DropdownItem>
    </>;

    let userUnauthed = <>
        <DropdownItem link="/login">Войти</DropdownItem>
        <DropdownItem link="/register">Регистрация</DropdownItem>
    </>

    return (
        <div className="menu-dropdown__wrapper">
            <button type="button" className="menu-button" onClick={() => setOpened(!opened)}><img src={menu_icon}/></button>
            <Dropdown onClick={closeMenu} opened={opened}>
                <DropdownItem link="/catalog">Каталог</DropdownItem>
                <DropdownItem link="/about">О проекте</DropdownItem>
                <DropdownItem>Учителям</DropdownItem>
                <DropdownItem>Ученикам</DropdownItem>
                
                { auth ? userAuthed : userUnauthed }
            </Dropdown>
        </div>
    )
}

function Profile() {
    const [opened, setOpened] = useState(false);
    const user = useSelector(selectUser);
    const auth = useSelector(selectUserAuthenticated);
    const dispatch = useDispatch();

    const closeMenu = () => setOpened(false);

    if (auth) {
        return <div className="profile__wrapper">
            <div className="profile" onClick={() => setOpened(!opened)}>
                <span className="profile__name">{user.username}</span>
                <img src={`${API_SERVER}/static/avatar/${user.id}`}/>
            </div>

            <Dropdown onClick={closeMenu} opened={opened}>
                <DropdownItem link={"/user/" + user.id}>Профиль</DropdownItem>
                <DropdownItem link={"/user/" + user.id + "/edit"}>Настройки</DropdownItem>
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
                <a href="/about" className="link-btn">О проекте</a>
                <a href="/create" className="link-btn">Конструктор</a>
                <a className="link-btn">Ученикам</a>
            </div>
            <Profile/>
            <NavMenu/>
        </nav>
    )
}