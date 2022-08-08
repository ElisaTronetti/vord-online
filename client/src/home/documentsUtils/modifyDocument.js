import { deleteLocalDocument } from '../fileSystemRequests'
import { deleteSharedDocument } from '../documentRequests'
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

export const deleteSharedDocuments = (user, files, deleteForMe) => {
    files.forEach((file) => {
        // Check if shared document
        if (!FileHelper.isDirectory(file) && file.isShared) {
            // Delete shared document from user
            deleteSharedDocument(user, file, deleteForMe)
        }
    })
}