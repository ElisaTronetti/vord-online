import { createErrorToast } from '../commonComponents/Toast'
import { deleteSharedDocument } from '../home/requests/documentRequests'

const DOCUMENT_LOCK_ENTER = 'document:lock:enter'
const DOCUMENT_LOCK_LEAVE = 'document:lock:leave'

export function openDocumentIfUnlocked(socket, document, setDocumentToOpen) {
    let documentId = document.id
    socket.emit(DOCUMENT_LOCK_ENTER, { documentId }, function (isDocumentLocked) {
        if (isDocumentLocked) {
            createErrorToast('The document select is corrently opened by someone else')
        } else {
            setDocumentToOpen(document)
        }
    })
}

export function deleteDocumentIfUnlocked(user, document, socket, dispatch) {
    let documentId = document.id
    socket.emit(DOCUMENT_LOCK_ENTER, { documentId }, function (isDocumentLocked) {
        if (isDocumentLocked) {
            createErrorToast('The document ' + document.name + ' is corrently opened by someone else, you can not delete it')
        } else {
            deleteSharedDocument(user, document, false, dispatch)
        }
    })
}

export function documentLockLeave(socket, documentId) {
    socket.emit(DOCUMENT_LOCK_LEAVE, { documentId })
}
