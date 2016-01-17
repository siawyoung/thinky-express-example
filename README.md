# thinky-express-example

I wrote this example to demonstrate a way to organise your Express app in a MVC way without resorting to complicated frameworks.

To get started:

```
$ npm install
$ npm start
```

This particular example is as barebones as possible. In particular, there're no explicit view layer to speak of - we're simply returning JSON. We could have implemented, for example, server-side rendered React/Redux into this example, and I intend to do that in as a seperate example.

There are a few concepts I want to talk about here:

- `routes.js`
- `schema.js`
- Model files
- Controller files

### `index.js`

First, we import `babel-polyfill` so that we can use `async/await`, which greatly simplifies working with promises and is the main reason behind the leanness of the code.

```js
import 'babel-polyfill'
```

Then, we import `express` and `body-parser` to create the main Express object, and to parse the body of `POST` requests that are sent in either `x-www-urlencoded` or JSON format.

```js
import express    from 'express'
import bodyParser from 'body-parser'
const app     = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
```

Then, we require the `config` file, which contains the connection details for RethinkDB. We inject the config object as a dependency to `schema.js`, which creates the connection to RethinkDB and bootstraps our database schema and table objects. I will be using this pattern a lot more throughout the framework.

```js
const config  = require('./config')
const models = require('./schema')(config)
```

### `schema.js`

In `schema.js`, we define the entire schema, not unlike `schema.rb` in Rails. I will defer the details of the syntax to the thinky documentation. Note that this file can swapped out for any other ORM if you want (Sequelize, etc).

After the schema is defined, we pass the thinky database objects to the model files:

```js
const allModels = { User, Post, Category }

return {
  User:     require('./models/User')(r, allModels),
  Post:     require('./models/Post')(r, allModels),
  Category: require('./models/Category')(r, allModels),
}
```

As a matter of convenience, I chose to pass all the models so that model methods can reference other database objects as well.

### Model Methods

Model methods serve as a way to encapsulate ORM logic and make it reusable. Even though ORMs themselves already offer a layer of abstraction on top of the database, I prefer having model methods as an additional layer to meet common needs in your application's business logic. Model methods are also handy in case you ever want to swap out the ORM for another one.

As an example, let's look at the User model:

```js
module.exports = (r, models) => {
  const { User } = models
  return {
    find: function(id) {
      const user = User.get(id)
      return user
    },

    create: function(params) {
      const { id, username, email } = params
      const newUser = new User({ id, username, email })
      return newUser.save()
    },
  }
}
```

A user has `find` and `create` methods, which behaves like `User.find` and `User.create` in Rails. The `find` method is simply a thin wrapper around the `User.get` thinky method, while `create` wraps around the `new User` and `save` thinky calls. This is especially notable because using constructor functions (`new`) is generally a bad idea (a questionable design decision on thinky's part), but wrapping it around our `create` model method limits the potential damage it can cause.

### Routing

Back to `index.js`, the routing is initialized by passing in the Express object and our models.

```js
require('./routes')(app, models)
```

The routes are found in `routes.js`, and is designed in a way as to mimic `routes.rb` functionality in Rails. I discuss further about the design behind this routing [here](/coding/javascript/2015-07-16-notes-on-rebuilding-a-web-server). One defines "top-level" resources in the `routes` constant - any routes defined in their corresponding router files will be mounted on the root. In this particular example, we have two top-level resources: `users` and `categories`.

```js
const routes = [
  'users',
  'categories'
]
```

Resources that are logically nested within another resources are defined in the `nestedRoutes` constant as a Map. Here, `posts` is a resource nested under `users`.

```js
const nestedRoutes = new Map()
nestedRoutes.set('users', ['posts'])
```

Let's look at the User controller:

```js
module.exports = (router, models) => {
  const { User } = models
  router.post('/', async (req, res) => {
    try {
      const newUser = await User.create(req.body)
      res.json(newUser)
    } catch(e) {
      res.sendStatus(422)
    }
  })
}
```

This particular endpoint is mounted on `POST /users` and is used to create a new user. As you can see, we destructure `models` and assign `User`, and call the `create` model method with the request's body. We then respond with `create`'s return value, which is the information of the newly-created user. If an exception is thrown during `create`, then we return a 422 to indicate a unprocessable entity.

### Conclusion

That pretty much sums up the entire "framework". As I mentioned, this is a very barebones example, but it serves as a solid base for a minimal MVC Express app. I may expand on this example with examples of custom middleware and actual explicit views (e.g. React).