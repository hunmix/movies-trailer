const Koa = require('koa')
const router = require('./router')

const { connect, initSchemas } = require('./db/init')

console.log(connect)

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/movie.js')
  // require('./tasks/api.js')
  // require('./tasks/trailer.js')
  // require('./tasks/qiniu.js')
})()

const app = new Koa()

app.use(router.routes()).use(router.allowedMethods())

app.listen(2018)
