const USER_REGISTER = 'user:register'

export function registerUser(socket, userId) {
    socket.emit(USER_REGISTER, { userId }, function () {
        console.log('User ' + userId + ' registered in web socket')
    })
}