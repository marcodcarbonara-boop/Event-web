const jwt = require('jsonwebtoken')

const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) return next(new Error('Autenticazione fallita'))

  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    socket.userId = decoded._id
    next()
  } catch (err) {
    next(new Error('Token non valido'))
  }
}

module.exports = socketAuth