import {useState} from "react"
import {useEventsContext} from "../hooks/useEventsContext"
import { useAuthContext } from "../hooks/useAuthContext"
import { useNavigate } from "react-router-dom"

const EventForm =()=>{
    const {dispatch} = useEventsContext()
    const {user}= useAuthContext()
    const navigate = useNavigate()

    const[title, setTitle]= useState('')
    const [date, setDate]= useState('')
    const [time, setTime] = useState('')
    const [location, setLocation]= useState('')
    const [mapsUrl, setMapsUrl] = useState('')
    const [description, setDescription] = useState('')
    const [maxParticipants, setMaxParticipants] = useState('')
    const [error, setError]= useState(null) 
    const [emptyFields, setEmptyFields] = useState([])

    const todayDate = new Date().toISOString().split('T')[0]

    const handleSubmit = async (e)=>{
        e.preventDefault()

        if(!user){
            setError('you must be logged in')
            return
        }

        const event = {title, date, time, location,mapsUrl, description, maxParticipants}

        const response = await fetch('${process.env.REACT_APP_API_URL}/api/events', {
            method: 'POST',
            body:JSON.stringify(event),
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()

        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields||[])
        }

        if(response.ok){ 
            setTitle('')
            setDate('')
            setTime('')
            setLocation('')
            setDescription('')
            setMaxParticipants('')
            setError(null)
            setEmptyFields([])

            console.log('new events added', json)
            dispatch({type: 'CREATE_EVENT', payload: json})
            navigate('/')
        }
    }
    return (
        <form className="create" onSubmit={handleSubmit}>
            <h3>Aggiungi un nuovo Evento</h3>

            <label> Titolo: *</label>
            <input
            type ="text"
            placeholder="titolo"
            onChange={(e)=> setTitle(e.target.value)}
            value={title}
            className={emptyFields.includes('title') ? 'error': ''}
            />

            <label> Data: *</label>
            <input
            type ="date"
            min={todayDate}
            onChange={(e)=> setDate(e.target.value)}
            value={date}
            className={emptyFields.includes('date') ? 'error': ''}

            />

            <label>Ora Evento: *</label>
            <input 
            type="time" 
            onChange={(e) => setTime(e.target.value)} 
            value={time}
            className={emptyFields.includes('time') ? 'error': ''}
            />

            <label> Luogo: *</label>
            <input
            type ="text"
            placeholder="via ..."
            onChange={(e)=> setLocation(e.target.value)}
            value={location}
            className={emptyFields.includes('location') ? 'error': ''}

            />
            <label>Link Google Maps:</label>
            <input 
            type="url" 
            placeholder="https://maps.google.com/..."
            onChange={(e) => setMapsUrl(e.target.value)} 
            value={mapsUrl}
            />
            <label>Numero massimo partecipanti: *</label>
            <input 
            type="number" 
            min="1"
            placeholder="10"
            onChange={(e) => setMaxParticipants(e.target.value)} 
            value={maxParticipants}
            className={emptyFields.includes('maxParticipants') ? 'error': ''}
            />

            <label>Descrizione:</label>
            <textarea onChange={(e) => setDescription(e.target.value)}
            value={description}              
             />
            <label>* campi obbligatori</label>
            <button>Aggiungi Evento</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default EventForm