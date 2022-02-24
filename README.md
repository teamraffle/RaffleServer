# RaffleServer
Server for Raffle

처음 git pull 이후 실행시 
```npm i```
```npm i -g yarn```
로 디펜던시 다운 후 raffle_server 파일안에 들어가서
yarn dev 또는 yarn start 실행하면 됨

파일구조 MVP
```D:\NodeJs\RaffleServer\raffle_web\README.md
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # DB models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

[보일러플레이트 출처](https://github.com/hagopj13/node-express-boilerplate)