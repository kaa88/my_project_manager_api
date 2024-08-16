# TODO
- add cache middleware ?
- проверка инпутов на хакеров
- на будущее - при гет делается 2 запроса к серверу (get + count), объединить в один через drizzle sql`` или еще как-то
- dto должен возвращать все поля, даже пустые... сделать опциональный midware, который будет "сжимать траффик", удаляя пустые поля
- ПОИСК
- добавить всем deletedAt (чтоб можно было восстановить и не было ошибок связей таблиц), а физически удалять по расписанию
- добавить связи моделей, чтобы в контроллерах не вызывать чужие модели и не менять ссылки вручную

# Задачи бэк
- запуск сервера и бд
- функционал авторизации
- подтверждение почты
- сброс пароля
- реализация демо пользователя
- таски

==================================

# Notes
"sql-install": "yarn global add vercel@latest && vercel env pull .env.development.local",


# Архитектура:
- app - express init, router paths
- db - подключение базы данных
- entities - логика, разделенная по категориям, включает router, controller, model...
- services - сервисы ошибок, авторизации и пр...
- shared - общие функции, базовые контроллеры, мапперы, DTO...
- static - assets, uploads
- scripts - разовые скрипты, нпр чистка БД


# Области видимости для юзера
- не в проекте - не видит ничего
- в проекте - видит только общие доски
- в команде - видит доски команды + общие
- админ - видит все доски проекта

# Где нужны связи таблиц
- board - project, team, list
- comment - project, task
- file - project, task
- label - project, task
- project - ALL ex. user
- task - project, label, list, comment, file
- taskList - project, board
- team - project, board
- user

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
- id
- role
- project id
- project sys name ?
- board id

для всего, что в борде, переделать projectId на boardId... и добавлять boadrId в куки