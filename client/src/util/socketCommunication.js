const USER_REGISTER = 'user:register'
const USER_LOGOUT = "user:logout"

export function registerUser(socket, userId) {
    socket.emit(USER_REGISTER, { userId }, function () {
        console.log('User ' + userId + ' registered in web socket')
    })
}

export function logoutUser(socket, userId) {
    socket.emit(USER_LOGOUT, {}, function () {
        console.log('User ' + userId + ' disconnected from web socket')
    })
}