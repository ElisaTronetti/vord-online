import { createContext } from "react"
import io from 'socket.io-client'
import { createNotificationToast } from "../commonComponents/Toast"

const DOCUMENT_UNLOCK_NOTIFICATION = "document:unlock:notification"

// Open socket
export const socket = io(process.env.REACT_APP_SERVER)
// Create context to handle the socket
export const SocketContext = createContext()

// Socket behavior
socket.on(DOCUMENT_UNLOCK_NOTIFICATION, (message) => {
    createNotificationToast(message)
})