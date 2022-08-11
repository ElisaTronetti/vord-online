import { deleteSharedDocument, deleteLocalDocument } from './documentRequests'
import { deleteDocumentIfUnlocked } from '../../util/resourcesLock'
import { FileHelper } from 'chonky'

export const deleteLocalDocuments = (user, files) => {
    files.forEach((file) => {
        // Check if local document
        if (!FileHelper.isDirectory(file) && !file.isShared) {
            // Delete local document from user
            deleteLocalDocument(user, file.id)
        }
    })
}

export const deleteSharedDocumentsForMe = (user, ownedDocuments) => {
    ownedDocuments.forEach((document) => {
        deleteSharedDocument(user, document, true)
    })
}

export const deleteSharedDocumentsForAll = (user, fileSystem, ownedDocuments, socket, dispatch) => {
    ownedDocuments.forEach((document) => {
        deleteDocumentIfUnlocked(user, fileSystem, document, socket, dispatch)
    })
}