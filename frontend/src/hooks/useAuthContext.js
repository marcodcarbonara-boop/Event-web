import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext=()=>{
    const context = useContext(AuthContext)

    if(!context){
        throw Error('useAuthtContext must be use inside an AuthContextProvider')
    }

    return context
}