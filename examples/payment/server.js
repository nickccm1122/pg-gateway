const koa = require('koa')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const cors = require('koa2-cors')
const forceSSL = require('koa-force-ssl')
import router from './routes'

/**
 * use PGGateway
 */

const app = new koa()

const PORT = 3000
app.use(bodyParser())

/**
 * CORS middleware
 * https://github.com/koajs/cors
 */
app.use(cors({
  origin: '*',
  allowMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS']
}))

/**
 * Enforce SSL in production environment
 */
if (process.env.NODE_ENV === 'production') {
  app.use(convert(forceSSL()))
}

// X-Response-Time
app.use(async (ctx, next) => {
  const start = new Date()
  console.log(ctx.response.headers)
  await next()
  const ms = new Date() - start
  ctx.set('X-Response-Time', `${ms} ms`)
})

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  console.log(`${ctx.method} ${ctx.url} - started`)
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms} ms`)
})

app.use(router.routes())
app.use(router.allowedMethods()) 

// Error logging
// app.on('error', (err, ctx) =>
//   winston.error('server error', err, ctx)
// )

app.listen(PORT)
console.log(`Server listening on ${PORT}`)