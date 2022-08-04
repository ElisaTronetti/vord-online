//import { LOCATION_CHANGE } from 'react-router-redux'
import { createErrorToast } from '../commonComponents/Toast'

const DOCUMENT_LOCK_ENTER = 'document:lock:enter'
const DOCUMENT_LOCK_LEAVE = 'document:lock:leave'

export function checkDocumentLock(socket, document, setDocumentToOpen) {
    let documentId = document.id
    socket.emit(DOCUMENT_LOCK_ENTER, { documentId }, function (isDocumentLocked) {
        if (isDocumentLocked) {
            createErrorToast('The document select is corrently opened by someone else')
        } else {
            setDocumentToOpen(document)
        }
    })
}

export function documentLockLeave(socket, documentId) {
    socket.emit(DOCUMENT_LOCK_LEAVE, { documentId })
}
