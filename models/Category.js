module.exports = (r, models) => {

  const { Category } = models

  return {

    getPosts: function(id) {
      const category = Category.get(id)
      const posts    = category.getJoin({ posts: true })
      return posts
    },

    create: function(params) {
      const newCategory = new Category(params)
      return newCategory.save()
    }

  }
}