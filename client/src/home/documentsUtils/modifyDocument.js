import { deleteSharedDocument, deleteLocalDocument } from './documentRequests'
import { deleteFolder } from '../folderRequests'
import { deleteDocumentIfUnlocked } from '../../util/resourcesLock'
import { isSharedDocumentOwned, isDocument, isDocumentLocal, isSharedDocument } from './documentUtils'

export const deleteElementsForMe = (user, elements, dispatch) => {
    elements.forEach((element) => {
        if (!isDocument(element)) {
            deleteFolder(user, element, dispatch)
        } else if (isDocumentLocal(element)) {
            deleteLocalDocument(user, element, dispatch)
        } else if (isSharedDocument(element)) {
            deleteSharedDocument(user, element, true, dispatch)
        }
    })
}

export const deleteElementsForAll = (user, elements, socket, dispatch) => {
    elements.forEach((element) => {
        if (!isDocument(element)) {
            deleteFolder(user, element, dispatch)
        } else if (isDocumentLocal(element)) {
            deleteLocalDocument(user, element, dispatch)
        } else if (!isSharedDocumentOwned(element)) {
            deleteSharedDocument(user, element, true, dispatch)
        } else if (isSharedDocumentOwned(element)){
            deleteDocumentIfUnlocked(user, element, socket, dispatch)
        }
    })   
}