const express = require('express')
const {
  getEventMessages,
  getPrivateMessages,
  sendMessage,
  getConversations
} = require('../controllers/messageController')
const requireAuth = require('../middleware/requireAuth')

const router = express.Router()

// Tutte le rotte richiedono l'autenticazione JWT
router.use(requireAuth)

router.get('/event/:eventId', getEventMessages)
router.get('/private/:userId', getPrivateMessages)
router.post('/', sendMessage)
router.get('/conversations', getConversations)


module.exports = router