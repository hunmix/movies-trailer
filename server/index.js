const Koa = require('koa')

const { connect, initSchemas } = require('./db/init')

console.log(connect)

;(async () => {
  await connect()

  initSchemas()

  require('./tasks/movie.js')
  require('./tasks/api.js')
})()

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(2018)
