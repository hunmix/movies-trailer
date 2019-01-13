const rp = require('request-promise-native')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

const baseUrl = 'http://api.douban.com/v2/movie/'

async function fetchMovie (item) {
  const url = `${baseUrl}${item.doubanId}`
  let res = await rp(url)
  try {
    res = JSON.parse(res)
  } catch (err) {
    console.log(err)
  }
  console.log(res)
  return res
}

;(async () => {
  let movies = await Movie.find({
    $or: [
      { summary: { $exists: false } },
      { summary: null },
      { title: '' },
      { summray: '' }
    ]
  })
  
  for (let i = 0; i < movies.length; i++) {
    let movie = movies[i]
    let movieData = await fetchMovie(movie)

    if (movieData) {
      let tags = movieData.tags || []

      movie.tags = movie.tags || []
      movie.summary = movieData.summary || ''
      movie.title = movieData.alt_title || movieData.title || ''
      movie.rawTitle = movieData.title || ''

      if (movieData.attrs) {
        movie.movieTypes = movieData.attrs.movie_type || []
        movie.year = movieData.attrs.year[0] || 2500

        movie.movieTypes.forEach(async item => {
          let cat = await Category.findOne({
            name: item
          })

          if (!cat) {
            cat = new Catrgory({
              name: item,
              movies: [movie._id]
            })
          } else {
            if (!cat.movies.include(movie.id)) {
              cat.movies.push(movie._id)
            }
          }

          await cat.save()

          if (!movie.category) {
            movie.category.push(cat._id)
          } else {
            if (!movie.category.include(cat._id)) {
              movie.category.push(cat._id)
            }
          }
        })

        let dates = movieData.attrs.pubdate || []
        let pubdates = []

        dates.map(item => {
          if (item && item.split('(').length > 0) {
            let parts = item.split('(')
            let date = parts[0]
            let country = '未知'

            if (parts[1]) {
              country = parts[1].split(')')[0]
            }

            pubdates.push({
              date: new Date(date),
              country
            })
          }
        })

        movie.pubdate = pubdates

        tags.forEach(tag => {
          movie.tags.push(tag.name)
        })
  
        await movie.save()
      }
    }
  }
})()