<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# Description

Project based on course *Nest: Desarrollo backend escalable con Node* from Udemy.
[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

# Installation
## Require

* Install NestJS
```bash
$ npm i -g @nestjs/cli
```

## Running the app

1. Clonar el repositorio
2. Ejecutar
```
npm install
```
3. Tener Nest CLI instalado
```
npm i -g @nestjs/cli
```

4. Docker - Levantar Mongodb

```bash
docker compose up -d
```

5. Clonar el archivo ```.env.template``` y renombar la copia a ```.env```

6. Llenar las variables de entorno definidas en el ```.env```

7. Ejecutar la aplicación en dev:
```bash
# watch mode
npm run start:dev
```

8. Reconstruir la base de datos con la semilla
```
{url}/api/v2/seed
```

# Production Build
1. Crear el archivo ```.env.prod```
2. Llenar las variables de entorno de prod
3. Crear la nueva imagen
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```

# Notas
Heroku redeploy sin cambios:
```
git commit --allow-empty -m "Tigger Heroku deploy"
git push heroku <master|main>
```

## Stack

* NestJS
* MongoDB
* Docker
