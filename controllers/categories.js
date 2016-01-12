module.exports = (router, models) => {

  const { Category } = models

  router.post('/', async (req, res) => {
    try {
      const newCategory = await Category.create(req.body)
      res.json(newCategory)
    } catch(e) {
      res.sendStatus(422)
    }
  })

  router.get('/:id', async (req, res) => {
    try {
      const posts = await Category.getPosts(req.params.id)
      res.json(posts)
    } catch(e) {
      res.sendStatus(404)
    }
  })

}