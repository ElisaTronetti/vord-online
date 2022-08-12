import { deleteSharedDocument, deleteLocalDocument } from './documentRequests'
import { deleteFolder } from '../folderRequests'
import { deleteDocumentIfUnlocked } from '../../util/resourcesLock'
import { FileHelper } from 'chonky'

export const deleteElements = (user, elements, dispatch) => {
    elements.forEach((element) => {
        if (FileHelper.isDirectory(element)) {
            deleteFolder(user, element, dispatch)
        } else if (!FileHelper.isDirectory(element) && !element.isShared) {
            deleteLocalDocument(user, element, dispatch)
        } else if (!FileHelper.isDirectory(element) && element.isShared) {
            deleteSharedDocument(user, element, true, dispatch)
        }
    })
}

export const deleteFolders = (user, files) => {
    files.forEach((file) => {
        if (FileHelper.isDirectory(file)) {
            deleteFolder(user, document)
        }
    })
}

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