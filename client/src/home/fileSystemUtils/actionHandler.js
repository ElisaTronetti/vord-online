import { ChonkyActions, FileHelper } from 'chonky'
import { useCallback } from 'react'
import { CopyDocument, CreateDocument, ManageSharedGroup, RenameElement, ShareDocument } from './actions'
import { openDocumentIfUnlocked } from '../../util/resourcesLock'
import { moveElements } from '../requests/fileSystemRequests'
import { copyDocument } from '../requests/documentRequests'

// Check the action and perform the specified function
export const useActionHandler = (user, socket, setModalController, setCurrentFolderId, setDocumentToOpen, dispatch) => {
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
                    if (!fileToOpen.isShared || fileToOpen.role === 1) {
                        // Open without lock checks if it is a local document or if it is open in read only mode
                        setDocumentToOpen(fileToOpen)
                    } else {
                        openDocumentIfUnlocked(socket, fileToOpen, setDocumentToOpen)
                    }
                }
            } else if (data.id === CopyDocument.id) {
                // Copy files
                copyDocument(user, data.state.selectedFilesForAction[0], dispatch)
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                setModalController(prevState => ({
                    ...prevState,
                    deleteElements: data.state.selectedFilesForAction
                }))
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveElements(
                    user,
                    data.payload.files,
                    data.payload.destination,
                    dispatch
                )
            } else if (data.id === ChonkyActions.CreateFolder.id) {
                // Show modal to create a new folder
                setModalController(prevState => ({
                    ...prevState,
                    createFolderModalShow: true
                }))
            } else if (data.id === CreateDocument.id) {
                // Show modal to create a new document
                setModalController(prevState => ({
                    ...prevState,
                    createDocumentModalShow: true
                }))
            } else if (data.id === ShareDocument.id) {
                // Show modal to share a document
                setModalController(prevState => ({
                    ...prevState,
                    shareDocument: data.state.selectedFilesForAction
                }))
            } else if (data.id === ManageSharedGroup.id) {
                setModalController(prevState => ({
                    ...prevState,
                    handleSharedGroup: data.state.selectedFilesForAction
                }))
            } else if (data.id ===  RenameElement.id) {
                setModalController(prevState => ({
                    ...prevState,
                    renameElement: data.state.selectedFilesForAction[0]
                }))
            }
        },
        [user, socket, setModalController, setCurrentFolderId, setDocumentToOpen, dispatch]
    )
}