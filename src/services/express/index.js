import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { errorHandler as queryErrorHandler } from 'querymen'
import { errorHandler as bodyErrorHandler } from 'bodymen'
import { token } from '../session'
import logger from '../logger'
import { log, jwtSecret, cookie } from '../../config'

export default (apiRoot, routes) => {
  const app = express()

  app.use(cors())
  app.use(compression())
  app.use(morgan(log.format, { stream: logger.stream }))

  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())
  app.use(cookieParser(jwtSecret, cookie))

  app.get('/', (req, res) => res.send('Digital Universe Server'))

  app.use(apiRoot, token)
  app.use(apiRoot, routes)

  app.use((err, req, res, next) => {
    let error

    if (req.querymen && req.querymen.error) {
      error = req.querymen.error
    } else if (req.bodymen && req.bodymen.error) {
      error = req.bodymen.error
    } else if (typeof err === 'string') {
      error = { message: err }
    } else {
      error = err
    }

    logger.error(
      error.message ? `${error.message} ${error.stack || ''}` : error
    )

    next(err)
  })
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())
  app.use((err, req, res, next) => {
    if (err.stack) {
      delete err.stack
    }

    let status = 500
    if (err.name === 'ValidationError') status = 400
    res
      .status(err.status || status)
      .json({
        param: err.param,
        value: err.value,
        valid: err.valid || false,
        message: err.message
      })
      .end()
  })

  return app
}