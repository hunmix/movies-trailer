const rp = require('request-promise-native')

const baseUrl = 'http://api.douban.com/v2/movie/subject/'

async function fetchMovie (item) {
  const url = `${baseUrl}${item.doubanId}`
  const res = await rp(url)
  return res
}

;(async () => {
  const movies = [
    { doubanId: 27172911,
      title: '幕后之王',
      rate: 0,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2522351682.jpg'
    },
    {
      doubanId: 30412085,
      title: '极速环游记',
      rate: 0,
      poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2544338455.jpg'
    }
  ]
  movies.map(async (movie) => {
    let movieData = await fetchMovie(movie)

    try {
      movieData = JSON.parse(movieData)
      console.log(movieData)
    } catch (err) {
      console.log(err)
    }
  })
})()