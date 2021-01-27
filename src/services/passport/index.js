import passport from 'passport'
import { Schema } from 'bodymen'
import { BasicStrategy } from 'passport-http'
import LocalStrategy from 'passport-local'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import bcrypt from 'bcrypt'
import { jwtSecret } from '../../config'
import User, { schema } from '../../api/user/model'

export const password = ({ roles = User.roles } = {}) => (req, res, next) =>
  passport.authenticate(
    ['password', 'local'],
    { session: false },
    (err, user) => {
      if (err && err.param) {
        return res.status(400).json(err)
      } else if (err || !user) {
        return res.status(403).json(err)
      } else if (err || !~roles.indexOf(user.role)) {
        return res
          .status(401)
          .json({ valid: false, message: 'You are not admin!' })
          .end()
      }
      req.logIn(user, { session: false }, (err) => {
        if (err) return res.status(403).json(err)
        next()
      })
    }
  )(req, res, next)

export const token = ({ required, roles = User.roles } = {}) => (
  req,
  res,
  next
) =>
  passport.authenticate('token', { session: false }, (err, user) => {
    if (err || (required && !user)) {
      return res
        .status(401)
        .json({
          valid: false,
          err: { message: 'Token is invalid', status: 401 }
        })
        .end()
    } else if (err || !~roles.indexOf(user.role)) {
      return res
        .status(401)
        .json({
          valid: false,
          err: { message: 'You are not admin!', status: 401 }
        })
        .end()
    }
    req.logIn(user, { session: false }, (err) => {
      if (err) {
        return res
          .status(401)
          .json({
            valid: false,
            err: {
              message: 'Something went wrong. Please try again',
              status: 401
            }
          })
          .end()
      }
      next()
    })
  })(req, res, next)

passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: true
    },

    function(email, password, done) {
      const userSchema = new Schema({
        email: schema.tree.email,
        password: schema.tree.password
      })
      userSchema.validate(
        {
          email,
          password
        },
        (err) => {
          if (err) done(err)
        }
      )

      process.nextTick(function() {
        User.findOne({ email }, async function(err, user) {
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(
              { valid: false, err: { message: 'Wrong email', status: 403 } },
              false
            )
          }
          const validPassword = await bcrypt.compare(password, user.password)
          if (!validPassword) {
            return done(
              { valid: false, err: { message: 'Wrong password', status: 403 } },
              false
            )
          }
          return done(null, user)
        })
      })
    }
  )
)

passport.use(
  'password',
  new BasicStrategy((email, password, done) => {
    const userSchema = new Schema({
      email: schema.tree.email,
      password: schema.tree.password
    })

    userSchema.validate(
      {
        email,
        password
      },
      (err) => {
        if (err) done(err)
        console.log(err)
      }
    )

    process.nextTick(function() {
      User.findOne({ email }, async function(err, user) {
        if (err) {
          return done(err)
        }
        if (!user) {
          return done(
            { valid: false, err: { message: 'Wrong email', status: 403 } },
            false
          )
        }
        const validPassword = await bcrypt.compare(password, user.password)
        if (!validPassword) {
          return done(
            { valid: false, err: { message: 'Wrong password', status: 403 } },
            false
          )
        }
        return done(null, user)
      })
    })
  })
)

passport.use(
  'token',
  new JwtStrategy(
    {
      secretOrKey: jwtSecret,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromUrlQueryParameter('access_token'),
        ExtractJwt.fromBodyField('access_token'),
        ExtractJwt.fromAuthHeaderWithScheme('Bearer')
      ])
    },
    ({ id }, done) => {
      User.findById(id)
        .then((user) => {
          done(null, user)
          return null
        })
        .catch(done)
    }
  )
)