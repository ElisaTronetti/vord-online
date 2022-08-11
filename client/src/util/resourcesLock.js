import { createErrorToast } from '../commonComponents/Toast'
import { deleteFiles } from '../home/fileSystemUtils/modifyFileSystem'
import { deleteSharedDocument } from '../home/documentsUtils/documentRequests'

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

export function deleteDocumentIfUnlocked(user, fileSystem, document, socket, dispatch) {
    let documentId = document.id
    socket.emit(DOCUMENT_LOCK_ENTER, { documentId }, function (isDocumentLocked) {
        if (isDocumentLocked) {
            createErrorToast('The document ' + document.name + ' is corrently opened by someone else, you can not delete it')
        } else {
            deleteSharedDocument(user, document, false)
            // Delete document from file system if not currently locked
            deleteFiles(user, fileSystem, [document], dispatch)
        }
    })
}

export function documentLockLeave(socket, documentId) {
    socket.emit(DOCUMENT_LOCK_LEAVE, { documentId })
}
