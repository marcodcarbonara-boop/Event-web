import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuthContext } from '../hooks/useAuthContext'

export const SocketContext = createContext()

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const { user } = useAuthContext()

  useEffect(() => {
    if (user) {
      // Connessione al server Socket.io passando il token JWT
      const newSocket = io(process.env.REACT_APP_API_URL, {
        auth: {
          token: user.token
        }
      })

      setSocket(newSocket)

      return () => newSocket.close()
    } else {
      if (socket) {
        socket.close()
        setSocket(null)
      }
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => useContext(SocketContext)