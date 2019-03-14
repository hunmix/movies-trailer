const Koa = require('koa')

const { connect, initSchemas } = require('./db/init')
const R = require('ramda')
const MIDDLEWARES = ['router']
const { resolve } = require('path')

const useMiddleWares = app => {
  R.map(
    R.compose(
      R.forEachObjIndexed(
        initWith => initWith(app)
      ),
      require,
      name => resolve(__dirname, `./middlewares/${name}`)
    )
  )(MIDDLEWARES)
}

;(async () => {
  await connect()

  initSchemas()

  // require('./tasks/movie.js')
  // require('./tasks/api.js')
  // require('./tasks/trailer.js')
  // require('./tasks/qiniu.js')
  const app = new Koa()
  await useMiddleWares(app)
  app.listen(2018)
  console.log('start on localhoset:2018')
})()

