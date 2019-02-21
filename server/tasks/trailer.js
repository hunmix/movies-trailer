const cp = require('child_process')
const {resolve} = require('path')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')
const Category = mongoose.model('Category')

;(async () => {
  let movies = await Movie.find({
    $or: [
      {viedo: { $exists: false}},
      {video: null},
      {video: ''}
    ]
  })
  const script = resolve(__dirname, '../crawler/video')
  console.log(script)
  const child = cp.fork(script, [])

  let invoked = false

  child.on('error', err => {
    if (invoked) return

    invoked = true
    
    console.log(err)
  })

  child.on('exit', code => {
    if (!invoked) return
    invoked = true
    let err = code === 0 ? null : new Error(`exit code${code}`)
    
    console.log(err)
  })

  child.on('message', async data => {
    let doubanId = data.doubanId
    let movie = await Movie.findOne({
      doubanId
    })

    if (data.video) {
      movie.video = data.video
      movie.cover = data.cover

      await movie.save()
    } else {
      await movie.remove()

      let movieTypes = movie.movieTypes
      for (let i = 0; i < movieTypes.length; i++) {
        let type = movieTypes[i]
        let cat = await Category.findOne({
          name: type
        })

        if (cat && cat.movies) {
          if (cat.movies.includes(movie._id)) {
            let index = cat.movies.indexOf(movie._id)
            cat.movies.splice(index, 1)
          }
          await cat.save()
        }
      }
      movieTypes.forEach(async type => {
        let cat = Category.findOne({
          name: type
        })

        if (cat && cat.movies) {
          if (cat.movies.include(movie._id)) {
            let index = cat.movies.indexOf(movie._id)
            cat.movies.splice(index, 1)
          }
          await cat.save()
        }
      })
    }
  })
  // movies = movies.filter((movie, index) => {
  //   return index < 5
  // })
  // console.log(movies)
  child.send(movies)
})()