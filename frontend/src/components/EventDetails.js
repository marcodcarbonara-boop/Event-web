import { useEventsContext } from "../hooks/useEventsContext"
import { useAuthContext } from "../hooks/useAuthContext"

//date-fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'


const EventDetails=( {event})=>{
    const {dispatch}= useEventsContext()
    const {user}= useAuthContext()

    const handleClick= async()=>{
        if(!user){
            return
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/` + event._id, {
            method:'DELETE',
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        })   
        const json= await response.json()

        if(response.ok){
            dispatch({type: 'DELETE_EVENT', payload: json})
        }

    }

    const isInterested = event.interestedUsers?.some(
        (u)=>(u._id || u) ===user?._id ||u.username=== user?.username
    )
    const handleInterest = async ()=>{
        if(!user){
            console.log('Utente non autenticato')
            return
        }
        try{        
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/events/${event._id}/interest`,{
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })
        const updatedEvent = await response.json()

        if (!response.ok) {
            console.error('Errore dal backend:', updatedEvent.error)
            return
        }
        console.log('Evento aggiornato con successo:', updatedEvent)

        if (response.ok) {
            dispatch({
                type: 'UPDATE_EVENT',
                payload: updatedEvent })
        }}catch (err) {
             console.error('Errore nella chiamata fetch:', err)
         }

        
        }

    console.log('Dati evento (event):', event)

    const currentParticipants = event.interestedUsers?.length || 0
    const isFull = event.maxParticipants && currentParticipants >= event.maxParticipants

    return(
        <div className="event-details">
            <h4>{event.title}</h4>
            <p><strong>Data: </strong>{new Date(event.date).toLocaleDateString('it-IT')}</p>
            <p><strong>Ora: </strong>{event.time}</p>
            <p><strong>Luogo: </strong>{event.location}</p>
            <p><strong>Partecipanti: </strong>{currentParticipants}/ {event.maxParticipants }</p>
            {user && ( <button className={`interest-btn ${isInterested ? 'active' : ''}`} 
                onClick={handleInterest}
                disabled={isFull && !isInterested}
            >
            
            {isInterested ? 'Annulla ' : 'Partecipa'}
        </button>
      )}


            <p>{formatDistanceToNow(new Date(event.createdAt), {addSuffix : true})}</p>

            {user &&  user.username === event.user_id?.username && (
                <span className="material-symbols-outlined" onClick={handleClick}>delete</span>
                )
            }

            
        </div>
    )
}

export default EventDetails