const Koa = require('koa')
const mongoose = require('mongoose')

const { connect, initSchemas } = require('./db/init')

console.log(connect)

;(async () => {
  await connect()

  initSchemas()

  require('./tasks/movie.js')
  
})()

const app = new Koa()

app.use(async (ctx, next) => {
  ctx.body = 'hello world'
})

app.listen(2018)
