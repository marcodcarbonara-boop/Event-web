import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useSocketContext } from '../context/SocketContext'

const PrivateChat = ({ recipientUser }) => {
  const { user } = useAuthContext()
  const { socket } = useSocketContext()
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const chatBottomRef = useRef(null)

  // 1. Carica i messaggi storici tra te e l'utente selezionato
  useEffect(() => {
    const fetchPrivateMessages = async () => {
      const response = await fetch(`http://localhost:4000/api/messages/private/${recipientUser._id}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
      const json = await response.json()
      if (response.ok) setMessages(json)
    }

    if (recipientUser && user) {
      fetchPrivateMessages()
    }
  }, [recipientUser, user])

  // 2. Ascolta i messaggi Socket in tempo reale
  useEffect(() => {
    if (!socket) return

    const handleReceivePrivate = (msg) => {
      // Aggiungi il messaggio solo se appartiene a questa conversazione
      const isFromCurrentChat = 
        msg.senderId?._id === recipientUser._id || 
        msg.reciverId === recipientUser._id ||
        msg.senderId === recipientUser._id

      if (isFromCurrentChat) {
        setMessages((prev) => [...prev, msg])
      }
    }

    socket.on('receive_private_message', handleReceivePrivate)

    return () => {
      socket.off('receive_private_message', handleReceivePrivate)
    }
  }, [socket, recipientUser])

  // Scroll in fondo automatico
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 3. Invio del messaggio via Socket
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socket) return

    socket.emit('send_private_message', {
      reciverId: recipientUser._id,
      text: newMessage
    })

    setNewMessage('')
  }

  return (
    <div className="chat-main-area">
      <div className="chat-header">
        <h2>{recipientUser.username}</h2>
        <small className="chat-header-subtitle">Messaggi Privati</small>
      </div>

      <div className="chat-content-body">
        {messages.map((msg) => {
          const isMe = (msg.senderId?._id || msg.senderId) === user._id
          return (
            <div
              key={msg._id}
              className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}
            >
              <span className="message-sender">{msg.senderId?.username || 'Utente'}</span>
              <div>{msg.text}</div>
            </div>
          )
        })}
        <div ref={chatBottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder={`Scrivi a ${recipientUser.username}...`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  )
}

export default PrivateChat