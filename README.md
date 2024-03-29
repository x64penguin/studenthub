# StudentHub
[![React](https://img.shields.io/badge/frontend-React-blue)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/backend-Flask-lightgrey)](https://flask.palletsprojects.com/en/2.2.x/)
[![npm](https://img.shields.io/badge/package-npm-green)](https://www.npmjs.com/)
![JavaScript](https://img.shields.io/badge/language-JavaScript-orange)
![Python](https://img.shields.io/badge/python%20version->=3.9-blue)

Сайт для создания и редактирования тестов в качестве школьного проекта написанный на [Flask](https://flask.palletsprojects.com/en/2.2.x/) и [React](https://reactjs.org/). 
Можно использовать в качестве базы для учебной платформы

## Запуск
#### 1. Установка
Копируем команды ниже в командную строку (терминал) по очереди
```
cd frontend
npm install
cd ..
python -m venv .venv
./.venv/Scripts/Activate.ps1
cd backend
pip install -r requirements.txt
flask db init
flask db migrate
flask db upgrade
```
>**Примечание:** это команды для Windows PowerShell, для командной строки (cmd) `./.venv/Scripts/Activate.ps1` надо заменить на `.\.venv\Scripts\activate.bat`
#### 2. Запуск
Запускаем сервер:

`.\.venv\Scripts\python.exe -m flask --app="backend/app.py" run --host=0.0.0.0` (Работает и для PowerShell и для cmd)

Затем копируем IP адрес из предпоследней строки выведенной в консоль вида `* Running on http://192.168.0.251:5000` и вставляем в файл `frontend/src/config.js`

Запускаем сайт: 
```
cd frontend
npm run start
```
## Страницы
* `/` - Главная страница, лендинг
* `/register` - Регистрация
* `/login` - Авторизация
* `/user/<user_id>` - Профиль пользователя
* `/user/<user_id>/edit` - Редактирование профиля, выход с устройств
* `/test/<test_id>` - Тест, а так же отображение лучшего и последнего результата
* `/test/<test_id>/edit` - Редактирование теста, конструктор заданий, просмотр результатов учеников
* `/solution/<solution_id>` - Страница с решением, после прохождения теста там отображаются правильные ответы. 
Можно попасть со страницы теста. Чужие решения смотреть нельзя

## Структура проекта
* `backend`
  * `static` - здесь хранятся все данные не табличного типа (картинки, текст и т.д.)
  * `app.db` - база данных, хранится информация о пользователях, решениях, сессиях и т.д.
  * `authorization.py` - все необходимые функции для работы с пользователем (вход, выход...)
  * `models.py` - описание всех моделей (таблиц) для базы данных со всеми связями
  * `routes.py` - функции для всех необходимых URL (api endpoints)
  * `utils.py` - вспомогательные функции
* `frontend`
  * `src`
    * `components` - все компоненты из которых состоит сайт (React components)
    * `pages` - все страницы сайта
    * `store` - хранилище браузера, фактически используется только для хранения текущего пользователя
    * `App.css` - главные стили сайта (задний фон, шрифт)
    * `App.jsx` - роутер (определение всех ссылок)
    * `common.css` - часто используемые стили
  * `.babelrc`, `.webpack.config.js` - файлы настроек для упаковывания сайта
>**Примечание:** webpack полностью настроен, но не используется
## Особенности
* Главная страница почти полностью сгенерирована нейросетью [ChatGPT](https://chat.openai.com)
* В каждом задании может быть несколько вопросов. В основном это для задания со вставками слов в текст. Каждый вопрос 
оценивается отдельно
* В настройках аккаунта можно выходить с других устройств, полезно если вы забыли выйти с общественного компьютера, например школьного