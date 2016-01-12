module.exports = (router, models) => {

  const { Post } = models

  router.post('/', async (req, res) => {
    try {
      const newPost = await Post.create(req.params.id, req.body)
      res.json(newPost)
    } catch(e) {
      res.sendStatus(422)
    }
  })

  router.get('/', async (req, res) => {
    try {
      res.json(await Post.getUserPosts(req.params.id))
    } catch(e) {
      res.sendStatus(404)
    }
  })

}