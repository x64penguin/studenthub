import {LinkButton} from "../../components/Button/LinkButton";
import "./Index.css";
import {useEffect} from "react";

export function Index() {
    useEffect(() => {
        document.title = "StudentHub";
    }, []);

    const Card = ({children}) => (
        <div className="index__card">
            {children}
        </div>
    );

    return (
        <div className="index-container">
            <h1 className="index__title">Редактор тестов для любых заданий</h1>
            <p className="index__description">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam dictum, leo euismod convallis viverra,
                ex quam pharetra lacus, a tincidunt lectus magna non nulla.
            </p>
            <div className="index__buttons-container">
                <LinkButton link="/create" className="index__create-test-button">Создать тест</LinkButton>
                <LinkButton link="/register" className="index__register-button" style="secondary">Регистрация</LinkButton>
            </div>
            <div className="index__cards-container">
                <Card>Крутая фича 1</Card>
                <Card>Обязательно выбирайте нас</Card>
                <Card>Прямо обязательно</Card>
                <Card>Я проверю</Card>
            </div>
        </div>
    );
}