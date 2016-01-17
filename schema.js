module.exports = config => {
  const thinky    = require('thinky')(config.rethinkdb)
  const r         = thinky.r
  const type      = thinky.type

  const User = thinky.createModel("User", {
    id:        type.string(),
    username:  type.string().required(),
    email:     type.string().email().required(),
  })

  const Post = thinky.createModel("Post", {
    id:        type.string(),
    content:   type.string().required(),
  })

  const Category = thinky.createModel("Category", {
    id:        type.string(),
    name:      type.string().required(),
  })

  User.hasMany(Post, "posts", "id", "userId")

  Post.belongsTo(User, "user", "userId", "id")
  Post.belongsTo(Category, "category", "categoryId", "id")

  Category.hasMany(Post, "posts", "id", "categoryId")

  const allModels = { User, Post, Category }

  return {
    User:     require('./models/User')(r, allModels),
    Post:     require('./models/Post')(r, allModels),
    Category: require('./models/Category')(r, allModels),
  }
}