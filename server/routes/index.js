const Router = require('koa-router')
const mongoose = require('mongoose')
const router = new Router()

router.get('/movies', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const movies = await Movie.find({})
  ctx.body = {
    movies
  }
})

router.get('/movie/:id', async (ctx, next) => {
  const Movie = mongoose.model('Movie')
  const id = ctx.params.id

  const movie = await Movie.findOne({_id: id})
  ctx.body = {
    movie
  }
})

module.exports = router
