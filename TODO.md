# TODO
- add cache middleware ?

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


Архитектура:

- app - init: router, controllers, db
- db? - подключение базы данных, модели
- features - логика, разделенная по категориям, включает крупные блоки, api funcs, store, utils
- router - объявление роутера, константы путей
- shared - общие функции, сервисы...
- uploads

- mapper / DTO
