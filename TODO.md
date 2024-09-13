# TODO
- add cache middleware ?
- проверка инпутов на хакеров
- на будущее - при гет делается 2 запроса к серверу (get + count), объединить в один через drizzle sql`` или еще как-то
- dto должен возвращать все поля, даже пустые... сделать опциональный midware, который будет "сжимать траффик", удаляя пустые поля
- ПОИСК
- в табл teamsToBoards тоже надо добавить projectId?
- ??? taskList тоже сделать projectElem, т.к. менять его может project admin ? или удалить и сделать в борде json по типу subtask

# Задачи бэк
+ базовые компоненты приложения (index.js, express settings, router)
+ подключение БД (настройки, адаптер для работы с БД, схема сущностей)
+ обработка ошибок
- скрипты для чистки БД

+ система многоуровневых сущностей (id - projectId - boardId)
+ basic elem module
+ projectElem module
- boardElem module

- user - создание, удаление, изменение
- авторизация (login, logout), токены, куки, рефреш (еще проверить вкл и выкл middleware)
- отправка писем - верификационное письмо при регистрации
- верификация email
- функционал изменения пароля
- функционал восстановления пароля - отправка письма, получение нового пароля через форму
- загрузка фото
- реализация демо пользователя

- projects - реализация и проверка всех сценариев
- labels - реализация и проверка всех сценариев
- boards - реализация и проверка всех сценариев
- teams - реализация и проверка всех сценариев
- boards & teams relations
- task - реализация и проверка всех сценариев
- comment - реализация и проверка всех сценариев
- file - реализация и проверка всех сценариев

==================================

# Notes
"sql-install": "yarn global add vercel@latest && vercel env pull .env.development.local",


# Архитектура:
- app - express init, router paths
- db - подключение базы данных
- entities - логика, разделенная по категориям, включает router, controller, model...
- scripts - разовые скрипты, нпр чистка БД
- services - сервисы ошибок, авторизации и пр...
- shared - общие функции, базовые контроллеры, мапперы, DTO...
- static - assets, uploads


# Области видимости для юзера
- не в проекте - не видит ничего
- в проекте - видит только общие доски
- в команде - видит доски команды + общие
- админ - видит все доски проекта


# Скрипты
- get user: find user
- get project: find project -> check if user in project members
- get label: find label -> find project -> check if user in project members
- get team: find team -> check if user in team members
- get board: find board -> find team -> check if user in team members
- get list: find list -> find board -> find team -> check if user in team members
- get task: find task -> find list -> find board -> find team -> check if user in team members
- get comment: find comment -> find task -> find list -> find board -> find team -> check if user in team members
- get file: find file -> find task -> find list -> find board -> find team -> check if user in team members


# Token
- user id
- project id ?
- board id ?
- role ?
- project sys name ?
