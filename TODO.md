# TODO
- add cache middleware ?
- проверка инпутов на хакеров
- на будущее - при гет делается 2 запроса к серверу (get + count), объединить в один через drizzle sql`` или еще как-то
- на будущее - добавить swagger/openapi
- dto должен возвращать все поля, даже пустые... сделать опциональный midware, который будет "сжимать траффик", удаляя пустые поля
- в табл teamsToBoards тоже надо добавить projectId?
- ??? taskList тоже сделать projectElem, т.к. менять его может project admin ? или удалить и сделать в борде json по типу subtask
- убрать refresh из кук, и сделать обратно в localstorage
- БД не поддерживает .default([]), надо переходить обратно на null

# Задачи бэк
+ базовые компоненты приложения (index.js, express settings, router)
+ подключение БД (настройки, адаптер для работы с БД, схема сущностей)
+ обработка ошибок
- скрипты для чистки БД

+ система многоуровневых сущностей (id - projectId - boardId)
+ basic elem module
- projectElem module
- boardElem module

+ user - создание, удаление, изменение
+ авторизация (login, logout), токены, куки, рефреш (еще проверить вкл и выкл middleware)
+ верификация email
+ функционал изменения пароля
+ функционал восстановления пароля
- отправка писем - письмо при регистрации / сброс пароля
- загрузка фото
- реализация демо пользователя

- projects - реализация и проверка всех сценариев
- labels - реализация и проверка всех сценариев
- teams - реализация и проверка всех сценариев, кроме relations
- boards - реализация и проверка всех сценариев, кроме relations
- boards & teams relations
- task - реализация и проверка всех сценариев
- comment - реализация и проверка всех сценариев
- file - реализация и проверка всех сценариев

- поиск

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

# test db
users - id 1,2,3
projects
  id 1, owner 1, admins 0, members 1,4
  id 2, owner 1, admins 2, members 1,2,5
  id 3, owner 3, admins 0, members 3
teams
  id 1, project 1, leader 1, members 1, boards 2,3
  id 2, project 1, leader 4, members 4, boards 3
  id 1, project 2, leader 2, members 1,2,5, boards 1
  id 1, project 3, leader 3, members 3, boards 1,2
boards
  id 1, project 1, teams - (public) --- visible for user 1,4
  id 2, project 1, teams 1 --- user 1
  id 3, project 1, teams 1,2 --- user 1,4
  id 1, project 2, teams 1 --- user 1,2,5
  id 1, project 3, teams 1 --- user 3
  id 2, project 3, teams 1 --- user 3

# Правила для БД
Используйте имена_с_подчёркиванием вместо CamelCase.
Имена таблиц должны быть во множественном числе.
Давайте расширенные названия для полей с идентификаторами (item_id вместо id).
Избегайте неоднозначных названий колонок.
По мере возможности именуйте колонки с внешними ключами так же, как колонки, на которые они ссылаются.
По мере возможности добавляйте NOT NULL во все определения колонок.
По мере возможности избегайте написания SQL, который может генерировать NULL-значения.