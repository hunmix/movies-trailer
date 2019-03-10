const Router = require('koa-router')
const glob = require('glob')
const { resolve } = require('path')

const symbolKey = Symbol('pathKey')
const routerMap = new Map()

export class Route{
  constructor(app, apiPath) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  init () {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)

    for (let [config, controller] of routerMap) {
      const controllers = toArray(controller)
      const method = config.method
      const prefixPath = config.target[symbolKey]
      if (prefixPath) prefixPath = normalizePath(prefixPath)
      const path = config.path
      const routerPath = `${prefixPath}${path}`
      this.router[method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}
const toArray = (controller) => Array.isArray(controller) ? controller : [controller]

const normalizePath = path => path.startsWith('/') ? path : `/${path}`

const router = config => (target, key, desprictor) => {
  config.path = normalizePath(config.path) 
  routerMap.set({
    target: target,
    ...config
  }, target[key])
}

export const controller = (path) => target => {
  target[symbolKey] = path
}
export const get = (path) => router({
  method: 'get',
  path
})
export const post = (path) => router({
  method: 'post',
  path
})

export const put = (path) => router({
  method: 'put',
  path
})

export const del = (path) => router({
  method: 'delete',
  path
})

export const all = (path) => router({
  method: 'all',
  path
})
