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
                Быстрый и удобный редактор тестов, позволяющий добавлять несколько вопросов в одно задание
            </p>
            <div className="index__buttons-container">
                <LinkButton link="/create" className="index__create-test-button">Создать тест</LinkButton>
                <LinkButton link="/register" className="index__register-button" style="secondary">Регистрация</LinkButton>
            </div>
            <div className="index__cards-container">
                <Card>Ввод и вставка слова</Card>
                <Card>Выбор и множественный выбор</Card>
                <Card>Задание на правильную последовательность</Card>
                <Card>Задание на соотношение</Card>
            </div>
        </div>
    );
}