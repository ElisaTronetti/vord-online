const USER_REGISTER = 'user:register'
const USER_LOGOUT = 'user:logout'
const DOCUMENT_SHARE = 'document:share'

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

export function notifyShareDocument(socket, userId, documentId, sharedGroup) {
    const sharedEmails = sharedGroup.map(user => user.email)
    socket.emit(DOCUMENT_SHARE, { documentId, sharedEmails}, function() {
        console.log('User ' + userId + ' shared the document to a group')
    })
}