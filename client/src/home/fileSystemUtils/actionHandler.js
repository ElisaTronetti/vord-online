import { ChonkyActions, FileHelper } from 'chonky'
import { useCallback } from 'react'
import { CopyDocument, CreateDocument, HandleSharedGroup, ShareDocument } from './actions'
import { openDocumentIfUnlocked } from '../../util/resourcesLock'
import { moveElements } from '../requests/fileSystemRequests'
import { copyDocument } from '../requests/documentRequests'

// Check the action and perform the specified function
export const useActionHandler = (user, socket,
    setCreateFolderModalShow, setCreateDocumentModalShow, setDeleteElements,
    setShareDocument, setCurrentFolderId, setDocumentToOpen, setHandleSharedGroup, dispatch) => {
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
                        openDocumentIfUnlocked(socket, fileToOpen, setDocumentToOpen)
                    }
                }
            } else if (data.id === CopyDocument.id) {
                // Copy files
                copyDocument(user, data.state.selectedFilesForAction[0], dispatch)
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                setDeleteElements(data.state.selectedFilesForAction)
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveElements(
                    user,
                    data.payload.files,
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
            } else if (data.id === HandleSharedGroup.id) {
                setHandleSharedGroup(data.state.selectedFilesForAction)
            }
        },
        [user, socket, setHandleSharedGroup, setCurrentFolderId, setShareDocument, setDeleteElements, setCreateDocumentModalShow, setCreateFolderModalShow, setDocumentToOpen, dispatch]
    )
}