const Message = require('../models/messageModel')
const User = require('../models/userModel')

// Recupera i messaggi della chat di un Evento
const getEventMessages = async (req, res) => {
  const { eventId } = req.params

  try {
    const messages = await Message.find({ eventId })
      .populate('senderId', 'username')
      .sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Recupera la lista degli utenti con cui c'è una conversazione aperta
const getConversations = async (req, res) => {
  try {
    const userId = req.user._id

    // 1. Trova TUTTI i messaggi privati dove l'utente è mittente o destinatario
    // (Ignoriamo i messaggi degli eventi che hanno reciverId: null)
    const privateMessages = await Message.find({
      $or: [
        { senderId: userId, reciverId: { $exists: true, $ne: null } },
        { reciverId: userId }
      ]
    }).sort({ createdAt: -1 })

    // 2. Estraiamo gli ID univoci delle persone con cui hai chattato
    const userIds = new Set()

    privateMessages.forEach(msg => {
      // Se il mittente NON sei tu, aggiungilo alla lista
      if (msg.senderId && String(msg.senderId) !== String(userId)) {
        userIds.add(String(msg.senderId))
      }
      // Se il destinatario NON sei tu, aggiungilo alla lista
      if (msg.reciverId && String(msg.reciverId) !== String(userId)) {
        userIds.add(String(msg.reciverId))
      }
    })

    // Se non ci sono conversazioni, restituisci array vuoto
    if (userIds.size === 0) {
      return res.status(200).json([])
    }

    // 3. Recupera i dati degli utenti trovati (escludendo la password)
    const users = await User.find({ _id: { $in: Array.from(userIds) } }).select('-password')

    res.status(200).json(users)
  } catch (error) {
    console.error("Errore getConversations:", error)
    res.status(500).json({ error: "Errore nel recupero delle conversazioni" })
  }
}

// Recupera i messaggi della chat Privata tra due utenti
const getPrivateMessages = async (req, res) => {
  const { userId: reciverId } = req.params
  const senderId = req.user._id

  try {
    const messages = await Message.find({
      $or: [
        { senderId: senderId, reciverId: reciverId },
        { senderId: reciverId, reciverId: senderId }
      ]
    })
      .populate('senderId', 'username')
      .sort({ createdAt: 1 })

    res.status(200).json(messages)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// Salva e invia un messaggio (può essere richiamato da rotte REST o helper Socket)
const sendMessage = async (req, res) => {
  const senderId = req.user._id
  const { reciverId, eventId, text } = req.body

  try {
    const message = await Message.create({
      senderId,
      reciverId: reciverId || null,
      eventId: eventId || null,
      text
    })

    const populatedMessage = await message.populate('senderId', 'username')
    res.status(200).json(populatedMessage)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  getEventMessages,
  getConversations,
  getPrivateMessages,
  sendMessage
}