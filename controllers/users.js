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