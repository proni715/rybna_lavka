/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '',
    defaultEmail: 'no-reply@first-project.com',
    sendgridKey: requireProcessEnv('SENDGRID_KEY'),
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtSecret: requireProcessEnv('JWT_SECRET'),
    log: {
      level: process.env.LOG_LEVEL || 'debug', // 'error', 'warn', 'info', 'verbose', 'debug', 'silly'
      format: process.env.LOG_FORMAT || 'dev' // 'short', 'default', 'combined', 'common', 'dev'
    },
    cookie: {
      maxAge: 2 * 30 * 24 * 60 * 60 * 1000, // 60 days
      httpOnly: true
    },
    mongo: {
      options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true
      }
    }
  },
  test: { },
  development: {
    mongo: {
      uri: 'mongodb://localhost/first-project-dev',
      options: {
        debug: true
      }
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    mongo: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost/first-project'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
