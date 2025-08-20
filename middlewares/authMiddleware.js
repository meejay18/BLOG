import jwt from 'jsonwebtoken'
export const authentication = async (req, res, next) => {
  const { token } = req.cookies
  if (!token) {
    return res.status(400).json({
      message: ' Token not found, please login to your account',
    })
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(400).json({
        message: 'Could not verify token',
      })
    }
    req.user = { id: payload.id, role: payload.role }
  })

  next()
}
