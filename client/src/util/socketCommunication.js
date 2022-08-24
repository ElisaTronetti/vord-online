const USER_REGISTER = 'user:register'
const USER_LOGOUT = "user:logout"

export function registerUser(socket, userId) {
    let socketId = socket.id
    console.log(socketId)
    socket.emit(USER_REGISTER, { userId, socketId }, function () {
        console.log('User ' + userId + ' registered in web socket')
    })
}

export function logoutUser(socket, userId) {
    let socketId = socket.id
    socket.emit(USER_LOGOUT, { userId, socketId }, function () {
        console.log('User ' + userId + ' disconnected from web socket')
    })
}