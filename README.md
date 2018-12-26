# 💡 Pezzo

### A blazing fast nodejs micro framework to make rest api

Based on the http module

## Controllers

Pezzo use the same api than express

```js
const { Router } = require("../../../src/index");

const Controller = {
  getCats(req, res) {
    res.status(200).send([
      {
        name: "SuperCat"
      }
    ]);
  },
  getCat(req, res) {
    res.status(200).send({
      name: "Another cat"
    });
  }
};

new Router({ baseUrl: "/cats" })
  .get("/", Controller.getCats)
  .get("/:cat_id", Controller.getCat);
```

All controllers must be in the `/controller` directory

There is no need to import them they are all autoloaded

### Middlewares

You can define middleware, it works the same as express

```js
const isAdmin = true;
function isAdministrator(req, res, next) {
  if (isAdmin) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

//Inside the controller
.get("/admin", Controller.getAdmin,[isAdministrator]);
```

### Form validation

You can easily validate incoming request body using validators

```js
const { validateBody } = require("../../../src/index");
const VALIDATION = {
  email: {
    required: "This field is required",
    isEmail: "Email invalid"
  },
  password: {
    required: "This field is required"
  }
};

//In the controller

.post("/login", Controller.login, [validateBody(VALIDATION)])
```

## Environnement

Pezzo uses mongodb and jwt by default

Define all your config variables inside the `.env` file

```env
APP_ENV=dev
APP_PORT=8081

JWT_SECRET=mysecret

MONGO_HOST=localhost
MONGO_PORT=27017
MONGO_DATABASE=myproject
```
