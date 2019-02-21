

const qiniu = require('qiniu')
const nanoid = require('nanoid')
const config = require('../config')
const mongoose = require('mongoose')
const Movie = mongoose.model('Movie')

const bucket = config.qiniu.bucket
const mac = new qiniu.auth.digest.Mac(config.qiniu.AK, config.qiniu.SK)
const qiniuConfig = new qiniu.conf.Config()
const bucketManager = new qiniu.rs.BucketManager(mac, qiniuConfig)

const updateToQiniu = async (url, key) => {
  return new Promise((resolve, reject) => {
    bucketManager.fetch(url, bucket, key, (err, resBody, resInfo) => {
      if (err) {
        reject(err)
      } else {
        if (resInfo.statusCode == 200) {
          resolve({key})
        } else {
          reject(resInfo)
        }
      }
    })
  })
}

;(async () => {
  
  // let movies = [{
  //   doubanId: '27006232',
  //   cover: 'https://img3.doubanio.com/img/trailer/medium/2542364051.jpg?',
  //   video: 'http://vt1.doubanio.com/201901152200/cdb5dbd1c176989234dcbeffe2419aef/view/movie/M/402400583.mp4',
  //   poster: 'https://img3.doubanio.com/img/trailer/medium/2542364051.jpg?'
  // }]
  let movies = await Movie.find({
    $or: [
      {videoKey: {$exists: false}},
      {videoKey: null},
      {videoKey: ''}
    ]
  })

  // console.log(movies)

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i]
    console.log('标题， vedio')
    console.log(movie.title, movie.video)
    if (movie.video && !movie.videoKey) {
      try {
        console.log('开始上传...')

        console.log(movie.cover)
        console.log(movie.poster)
        console.log(movie.poster)

        let videoData = await updateToQiniu(movie.video, `${nanoid()}.mp4`)
        let coverData = await updateToQiniu(movie.cover, `${nanoid()}.png`)
        let posterData = await updateToQiniu(movie.poster, `${nanoid()}.png`)

        console.log('上传完毕...')

        console.log(videoData)
        console.log(coverData)

        if (videoData.key) {
          movie.videoKey = videoData.key
        }
        if (coverData.key) {
          movie.coverKey = coverData.key
        }
        if (posterData.key) {
          movie.posterKey = posterData.key
        }
        await movie.save()
        // console.log(movie)
      } catch (error) {
        console.log(error)
      }
    }
  }
})()
