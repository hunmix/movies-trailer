const mongoose = require('mongoose')
const glob = require('glob')
const { resolve } = require('path')

const db = 'mongodb://localhost:27017/movies'
console.log('init')
mongoose.Promise = global.Promise

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

exports.connect = () => {
  let maxConnectTime = 0
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV !== 'production') {
      mongoose.set('debug', true)
    }
  
    mongoose.connect(db)
  
    mongoose.connection.on('disconnected', () => {
      if (maxConnectTime < 3) {
        mongoose.connect(db)
        maxConnectTime++
      } else {
        reject(err)
        throw new Error('数据库挂了，嘻嘻')
      }
    })
  
    mongoose.connection.on('error', err => {
      reject(err)
      throw new Error('数据库挂了，嘻嘻')
    })
  
    mongoose.connection.once('open', () => {
      console.log('MongoDB connected successfully')
      resolve()
    })
  })
}
