import { ChonkyActions, FileHelper } from 'chonky'
import { useCallback } from 'react'
import { moveFiles, copyDocuments } from './modifyFileSystem'
import { CopyDocument, CreateDocument, ShareDocument } from './actions'
import { checkDocumentLock } from '../../util/resourcesLock'

// Check the action and perform the specified function
export const useActionHandler = (user, fileSystem, socket,
    setCreateFolderModalShow, setCreateDocumentModalShow, setDeleteElements,
    setShareDocument, setCurrentFolderId, setDocumentToOpen, dispatch) => {
    return useCallback(
        data => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload
                const fileToOpen = targetFile ?? files[0]
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    // Open folder
                    setCurrentFolderId(fileToOpen.id)
                } else {
                    // Open document
                    if (!fileToOpen.isShared) {
                        // Open without lock checks if it is a local document
                        setDocumentToOpen(fileToOpen)
                    } else {
                        checkDocumentLock(socket, fileToOpen, setDocumentToOpen)
                    }
                }
            } else if (data.id === CopyDocument.id) {
                // Copy files
                copyDocuments(user, fileSystem, data.state.selectedFilesForAction, dispatch)
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                setDeleteElements(data.state.selectedFilesForAction)
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveFiles(
                    user,
                    fileSystem,
                    data.payload.files,
                    data.payload.source,
                    data.payload.destination,
                    dispatch
                )
            } else if (data.id === ChonkyActions.CreateFolder.id) {
                // Show modal to create a new folder
                setCreateFolderModalShow(true)
            } else if (data.id === CreateDocument.id) {
                // Show modal to create a new document
                setCreateDocumentModalShow(true)
            } else if (data.id === ShareDocument.id) {
                // Show modal to share a document
                setShareDocument(data.state.selectedFilesForAction)
            }
        },
        [user, fileSystem, socket, setCurrentFolderId, setShareDocument, setDeleteElements, setCreateDocumentModalShow, setCreateFolderModalShow, setDocumentToOpen, dispatch]
    )
}