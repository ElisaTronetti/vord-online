import { FileHelper } from 'chonky'

export const isSharedDocumentOwned = (document) => {
    return isDocument(document) && isSharedDocument(document) && isOwner(document)
}

export const isDocumentLocal = (document) => {
    return isDocument(document) && !isSharedDocument(document)
}

export const isDocument = (document) => {
    return !FileHelper.isDirectory(document)
}

export const isSharedDocument = (document) => {
    return document.isShared
}

function isOwner(document) {
    if (document.role !== undefined) {
        return document.role === 3
    } else {
        return false
    }
}