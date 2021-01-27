import http from 'http'
import { env, mongo, port, ip, apiRoot } from './config'
import mongoose from './services/mongoose'
import express from './services/express'
import api from './api'
import bodyParser from 'body-parser'
import logger from './services/logger'
import figlet from 'figlet'
import cors from 'cors'

const app = express(apiRoot, api)
const server = http.createServer(app)

app.use(cors())


app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

if (mongo.uri) {
  mongoose.connect(mongo.uri)
}
mongoose.Promise = Promise

setImmediate(() => {
  server.listen(port, ip, () => {
    logger.info(
      'Express server listening on http://%s:%d, in %s mode',
      ip,
      port,
      env
    )
    figlet(
      'Rybna Lavka Server',
      { horizontalLayout: 'fitted' },
      (err, data) => (err ? logger.error(err) : console.log(data))
    )
  })
})

export default app
