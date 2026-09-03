import { EventsContext } from "../context/EventContext";
import { useContext } from "react";

export const useEventsContext=()=>{
    const context = useContext(EventsContext)

    if(!context){
        throw Error('useEventContext deve essere usato dentro EventsContextProvider')
    }

    return context
}