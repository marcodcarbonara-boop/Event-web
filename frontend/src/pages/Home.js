import { useEffect, useState } from "react"

import { useEventsContext } from "../hooks/useEventsContext"
import {useAuthContext} from "../hooks/useAuthContext"

//component
import EventDetails from '../components/EventDetails'
import EventPanel from "../components/EventPanel"



const Home=()=>{
    const {events, dispatch}= useEventsContext()
    const [selectedEvent, setSelectedEvent] = useState(null)
    const {user}= useAuthContext()

    useEffect(()=>{

    const fetchEvent =async()=>{
        const responce = await fetch('${process.env.REACT_APP_API_URL}/api/events',{
            headers:{
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await responce.json()

        if(responce.ok){
            dispatch({type: 'SET_EVENTS', payload: json})
        }
    }

    if(user){
    fetchEvent()
    }
    },[dispatch, user])

    const handleEventClick = (event) => {
        setSelectedEvent((prevSelected) => 
            prevSelected?._id === event._id ? null : event
        )
    }

    return(
        <div className="home">
            <div className="events">
                {events && events.map((event)=> (
                    <div key={event._id} onClick={()=> handleEventClick(event)}>
                        <EventDetails event={event}/>
                    </div>
                ))}
            </div>
            <EventPanel
            event={selectedEvent}
            onClose={()=>setSelectedEvent(null)}/>
        </div>
    )
}

export default Home