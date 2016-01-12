module.exports = (r, models) => {

  const { Post, User, Category } = models

  return {

    getUserPosts: async function(userId) {
      const user  = await User.get(userId)
      const posts = user.getJoin({ posts: true })
      return posts
    },

    create: async function(userId, params) {

      const { content } = params

      const user     = await User.get(userId)
      const category = await Category.get(params['category'])
      const post     = new Post({ content })
      post.user     = user
      post.category = category
      return post.saveAll()

    }

  }
}