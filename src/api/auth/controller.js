import { sign } from '../../services/jwt'
import { success } from '../../services/response/'
import { cookie } from '../../config'

const tokenCookieOptions = Object.assign({ signed: true }, cookie)

export const login = ({ user }, res, next) =>
  sign(user.id)
    .then((token) => {
      res.cookie('token', token, tokenCookieOptions)
      return { token, user: user.view(true) }
    })
    .then(success(res, 201))
    .catch(next)
