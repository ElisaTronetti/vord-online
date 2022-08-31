import { deleteSharedDocument, deleteLocalDocument } from '../requests/documentRequests'
import { deleteFolder } from '../requests/folderRequests'
import { deleteDocumentIfUnlocked } from '../../util/resourcesLock'
import { isSharedDocumentOwned, isDocument, isDocumentLocal, isSharedDocument } from './documentUtils'

export const deleteElementForMe = (user, element, dispatch) => {
    if (!isDocument(element)) {
        deleteFolder(user, element, dispatch)
    } else if (isDocumentLocal(element)) {
        deleteLocalDocument(user, element, dispatch)
    } else if (isSharedDocument(element)) {
        deleteSharedDocument(user, element, true, dispatch)
    }
}

export const deleteElementForAll = (user, element, socket, dispatch) => {
    if (!isDocument(element)) {
        deleteFolder(user, element, dispatch)
    } else if (isDocumentLocal(element)) {
        deleteLocalDocument(user, element, dispatch)
    } else if (!isSharedDocumentOwned(element)) {
        deleteSharedDocument(user, element, true, dispatch)
    } else if (isSharedDocumentOwned(element)) {
        deleteDocumentIfUnlocked(user, element, socket, dispatch)
    }
}