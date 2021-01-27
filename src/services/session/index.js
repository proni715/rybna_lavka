export const token = (req, res, next) => {
    if (
      req.headers.authorization ||
      req.query.access_token ||
      req.body.access_token
    ) {
      return next()
    }
  
    if (req.path.startsWith('/auth')) {
      return next()
    }
  
    const { token } = req.signedCookies
  
    if (token) {
      req.headers.authorization = `Bearer ${token}`
    }
  
    next()
  }