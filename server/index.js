const Koa = require('koa')
const { router } = require('./middlewares/router')

const { connect, initSchemas } = require('./db/init')

console.log(connect)

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/movie.js')
  // require('./tasks/api.js')
  // require('./tasks/trailer.js')
  // require('./tasks/qiniu.js')
  const app = new Koa()
  router(app)
  app.listen(2018)

})()

