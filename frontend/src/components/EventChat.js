import { useState, useEffect, useRef } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import { useSocketContext } from '../context/SocketContext'

const EventChat = ({ eventId , onSelectUser}) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const { user } = useAuthContext()
  const { socket } = useSocketContext()
  const chatBottomRef = useRef(null)

  // 1. Carica lo storico messaggi via REST API
  useEffect(() => {
    const fetchMessages = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/messages/event/${eventId}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()
      if (response.ok) {
        setMessages(json)
      }
    }

    if (user && eventId) {
      fetchMessages()
    }
  }, [eventId, user])

  // 2. Gestione degli eventi WebSocket in tempo reale
  useEffect(() => {
    if (!socket || !eventId) return

    // Entra nella stanza dell'evento
    socket.emit('join_event', eventId)

    // Ascolta nuovi messaggi in arrivo
    const handleReceiveMessage = (message) => {
      if (message.eventId === eventId || message.eventId === `event_${eventId}`) {
        setMessages((prevMessages) => [...prevMessages, message])
      }
    }

    socket.on('receive_event_message', handleReceiveMessage)

    // Cleanup alla chiusura del componente
    return () => {
      socket.emit('leave_event', eventId)
      socket.off('receive_event_message', handleReceiveMessage)
    }
  }, [socket, eventId])

  // Scroll automatico in basso alla ricezione di nuovi messaggi
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // 3. Invio di un nuovo messaggio
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    const messageData = {
      eventId,
      text: newMessage
    }

    // Invio via socket per aggiornare gli altri client in tempo reale
    if (socket) {
      socket.emit('send_event_message', messageData)
    }

    setNewMessage('')
  }

  return (
   <div className="chat-main-area">
      <div className="chat-content-body">
        {messages.map((msg) => {
          const isMe = (msg.senderId?._id || msg.senderId) === user._id

          return (
            <div
              key={msg._id || Math.random()}
              className={`message-bubble ${isMe ? 'my-message' : 'other-message'}`}
            >
              <span className="message-sender" onClick={()=> onSelectUser(msg.senderId)}>
                {msg.senderId?.username || 'Utente'}
              </span>
              <div>{msg.text}</div>
            </div>
          )
        })}
        <div ref={chatBottomRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Scrivi un messaggio..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Invia</button>
      </form>
    </div>
  )
}

export default EventChat