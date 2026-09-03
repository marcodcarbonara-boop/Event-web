const Message = require('../models/messageModel')

const socketController = (io, socket) => {
  // Stanza personale dell'utente per messaggi privati
  socket.join(socket.userId)

  // 1. CHAT DI GRUPPO EVENTO
  socket.on('join_event', (eventId) => {
    socket.join(`event_${eventId}`)
  })

  socket.on('leave_event', (eventId) => {
    socket.leave(`event_${eventId}`)
  })

  socket.on('send_event_message', async ({ eventId, text, image, video }) => {
    try {
      const message = await Message.create({
        senderId: socket.userId,
        eventId,
        text,
        image,
        video
      })
      const populatedMsg = await message.populate('senderId', 'username')
      // Trasmette il messaggio a tutti gli utenti nella stanza dell'evento
      io.to(`event_${eventId}`).emit('receive_event_message', populatedMsg)
    } catch (err) {
      console.error(err)
    }
  })

  // 2. CHAT PRIVATA 1-A-1
  socket.on('send_private_message', async ({ reciverId, text, image, video }) => {
    try {
      const message = await Message.create({
        senderId: socket.userId,
        reciverId,
        text,
        image,
        video
      })
      const populatedMsg = await message.populate('senderId', 'username')

      io.to(reciverId).emit('receive_private_message', populatedMsg)
      socket.emit('receive_private_message', populatedMsg)
    } catch (err) {
      console.error(err)
    }
  })

  socket.on('disconnect', () => {})
}

module.exports = socketController