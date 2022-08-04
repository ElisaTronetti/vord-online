import { createContext } from "react"
import io from 'socket.io-client'

// Open socket
export const socket = io(process.env.REACT_APP_SERVER)
// Create context to handle the socket
export const SocketContext = createContext()