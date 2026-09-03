import React from "react";

const EventPanel =({event, onClose})=>{
  if(!event){
    return null
  }
  

  const googleMapsSearchUrl =event.mapsUrl ||
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    return (
      <div className="panel-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <span className="material-symbols-outlined">close</span>
        </button>

        <h2>{event.title}</h2>
        <hr />

        <div className="panel-body">
          <p><strong>Data:</strong> {new Date(event.date).toLocaleDateString('it-IT')}</p>
          <p><strong>Ora:</strong> {event.time}</p>


          <div className="location-info">
            <p><strong>Luogo:</strong> {event.location}</p>
            <a href={googleMapsSearchUrl} target="_blank" rel="noopener noreferrer" className="maps-link">
              <span className="material-symbols-outlined">location_on</span>
              Apri su Google Maps
            </a>
          </div>
          
          <p><strong>Organizzatore:</strong> {event.user_id?.username}</p>
          <p><strong>Partecipanti:</strong> {event.interestedUsers?.length || 0} / {event.maxParticipants}</p>
          
          <div className="description-section">
            <h4>Descrizione:</h4>
            <p>{event.description}</p>
          </div>

          {/* Se hai popolato interestedUsers nel backend, puoi mostrare chi partecipa */}
          {event.interestedUsers && event.interestedUsers.length > 0 && (
            <div className="participants-section">
              <h4>Lista partecipanti:</h4>
              <ul>
                {event.interestedUsers.map((u) => (
                  <li key={u._id || u}>{u.username || 'Utente'}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
  )
}
export default EventPanel