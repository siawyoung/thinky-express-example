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