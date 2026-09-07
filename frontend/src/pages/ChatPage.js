import { useState, useEffect } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import EventChat from '../components/EventChat'
import PrivateChat from '../components/PrivateChat'

const ChatPage = () => {
  const { user } = useAuthContext()
  const [activeTab, setActiveTab] = useState('events')
  // Lista eventi e chat evento attiva
  const [userEvents, setUserEvents] = useState([])
  const [activeChat, setActiveChat] = useState(null)  
  // Lista utenti e utente privato attivo
  const [allUsers, setAllUsers] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [recentConversations, setRecentConversations] = useState([])

  // Recupera tutti gli eventi a cui l'utente è iscritto/interessato o che ha creato
  useEffect(() => {
    const fetchUserChats = async () => {
      const response = await fetch('${process.env.REACT_APP_API_URL}/api/events', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      const json = await response.json()
      console.log("JSON dal backend:", json)
      console.log("Utente loggato:", user)

      if (response.ok) {
        const myChats = json.filter(event => {
          // Estrai l'ID del creatore (sia se è una stringa che un oggetto popolato)
          const creatorId = typeof event.user_id === 'object' ? event.user_id?._id : event.user_id
          
          // Controlla se l'utente è il creatore
          const isCreator = creatorId && String(creatorId) === String(user._id)

          // Controlla gli array di partecipazione/interesse
          const isInterested = event.interestedUsers?.some(u => {
            const interestedId = typeof u === 'object' ? u?._id : u
            return String(interestedId) === String(user._id)
          })
          return isCreator || isInterested 
        })

        setUserEvents(myChats)
       }
    }
    if (user) {
      fetchUserChats()
    }
  }, [user])

  useEffect(() => {
    if (userEvents.length > 0 && !activeChat) {
      setActiveChat(userEvents[0])
    }
  }, [userEvents, activeChat])

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const resConvs = await fetch('${process.env.REACT_APP_API_URL}/api/messages/conversations', {
          headers: { 'Authorization': `Bearer ${user.token}` }
        })
        if (resConvs.ok) {
          const convsJson = await resConvs.json()
          setRecentConversations(convsJson)
        }
      } catch (err) {
        console.error("Errore fetch conversazioni:", err)
      }
    }

    if (user) {
      // Carica gli utenti (basta una volta)
      fetch('${process.env.REACT_APP_API_URL}/api/user', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      })
        .then(async (res) => {
          if (!res.ok) throw new Error(`Errore HTTP: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log("Utenti ricevuti:", data);
          // Rimuove l'utente loggato dalla lista
          if (Array.isArray(data)) {
            const altriUtenti = data.filter(u => u._id !== user._id);
            setAllUsers(altriUtenti);
          }
        })
        .catch(err => console.error("Errore fetch utenti:", err)); 

      // Carica le conversazioni recenti
      fetchConversations()
    }
  }, [user])

  const handleSelectUser = (targetUser) => {
    if (!targetUser) return

    // Estrai l'ID a prescindere che sia un oggetto o una stringa
    const targetId = typeof targetUser === 'object' ? targetUser._id : targetUser

    // Evita di aprire la chat con se stessi
    if (targetId === user._id) {
      return
    }
    // Cerca l'utente completo tra le conversazioni recenti o tutti gli utenti
    const fullUser = 
      recentConversations.find(u => u._id === targetId) || 
      allUsers.find(u => u._id === targetId) || 
      (typeof targetUser === 'object' ? targetUser : { _id: targetId })

    setActiveUser(fullUser)
    setActiveTab('users')
  }

 return (
  <div className="chat-page-container">
    {/* Sidebar */}
    <div className="chat-sidebar">
      <h3>Le tue Chat</h3>
      <div className="chat-tabs-container">
        <button 
          className={`chat-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')} 
        >
          Eventi
        </button>
        <button 
          className={`chat-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')} 
        >
          Utenti
        </button>
      </div>

      {activeTab === 'events' ? (
      <>
      <h3>Chat Eventi</h3>
      {userEvents.length === 0 ? (
        <p className="chat-empty-message">Non sei iscritto a nessuna chat</p>
      ) : (
        userEvents.map(event => (
          <div key={event._id} onClick={() => setActiveChat(event)}
          className={`chat-item ${activeChat?._id === event._id ? 'active' : ''}`}
          >
            <strong className="chat-item-title">{event.title}</strong>
            <small className="chat-item-location">📍 {event.location}</small>
          </div>
        ))
      )}
      </>
        ) : (
          <>
            {/* Sezione Conversazioni Attive / Messaggi Ricevuti */}
            {recentConversations.length > 0 && (
              <>
                <h3>Conversazioni</h3>
                {recentConversations.map(u => (
                  <div
                    key={u._id}
                    onClick={() => setActiveUser(u)}
                    className={`chat-item ${activeUser?._id === u._id ? 'active' : ''}`}
                  >
                    <strong className="chat-item-title">{u.username}</strong>
                    <small className="chat-item-location">💬 Messaggio ricevuto/inviato</small>
                  </div>
                ))}
                <hr style={{ margin: '15px 0', borderColor: '#eee' }} />
              </>
            )}

            <h3>Tutti gli Utenti</h3>
            {allUsers.length === 0 ? (
              <p className="chat-empty-message">Nessun altro utente trovato</p>
            ) : (
              allUsers.map(u => (
                <div
                  key={u._id}
                  onClick={() => setActiveUser(u)}
                  className={`chat-item ${activeUser?._id === u._id ? 'active' : ''}`}
                >
                  <strong className="chat-item-title">{u.username}</strong>
                  <small className="chat-item-location">{u.email}</small>
                </div>
            ))
          )}
        </>
      )}
    </div>

    {/* Area Chat Principale */}
      <div className="chat-main-wrapper">
        {activeTab === 'events' ? (
          activeChat ? (
            <div className="chat-main-area">
              <div className="chat-header">
                <h2>{activeChat.title}</h2>
                <small className="chat-header-subtitle">Chat di gruppo dell'evento</small>
              </div>
              <EventChat eventId={activeChat._id} 
                onSelectUser={handleSelectUser}    
              />
            </div>
          ) : (
            <div className="chat-placeholder">Seleziona un evento per iniziare</div>
          )
        ) : (
          activeUser ? (
            <PrivateChat recipientUser={activeUser} />
          ) : (
            <div className="chat-placeholder">Seleziona un utente per inviare un messaggio privato</div>
          )
        )}
      </div>
  </div>
)
}

 export default ChatPage