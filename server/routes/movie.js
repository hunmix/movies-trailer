const mongoose = require('mongoose')
const { controller, get } = require('../lib/decorator')

@controller('api/v0/movies')
class MovieController{
  @get('/')
  async getMovies () {
    const Movie = mongoose.model('Movie')
    const movies = await Movie.find({})
    ctx.body = {
      success: true,
      data: movies
    }
  }
  @get('/:id')
  async getMovieDetail () {
    const Movie = mongoose.model('Movie')
    const id = ctx.params.id
    const movie = await Movie.findOne({_id: id})
    ctx.body = {
      success: true,
      data: movies
    }
  }
}