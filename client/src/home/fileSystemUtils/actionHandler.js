import { ChonkyActions, FileHelper } from 'chonky'
import { useCallback } from 'react'
import { CopyDocument, CreateDocument, ManageSharedGroup, RenameElement, ShareDocument } from './actions'
import { openDocumentIfUnlocked } from '../../util/resourcesLock'
import { moveElements } from '../requests/fileSystemRequests'
import { copyDocument } from '../requests/documentRequests'
import { createErrorToast, createSuccessToast } from '../../commonComponents/toast/Toast'
import { isSharedDocumentOwned } from '../documentsUtils/documentUtils'

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
                    if (!fileToOpen.isShared) {
                        // Open without lock checks if it is a local document
                        setDocumentToOpen(fileToOpen)
                    } else if (fileToOpen.role === 1) {
                        // Open without lock checks if it is a read only document
                        setDocumentToOpen(fileToOpen)
                        createSuccessToast('Opening document in read only mode')
                    } else {
                        openDocumentIfUnlocked(socket, fileToOpen, setDocumentToOpen)
                    }
                }
            } else if (data.id === CopyDocument.id) {
                if (data.state.selectedFilesForAction.length > 1) {
                    createErrorToast('Multi document copy is not supported')
                } else {
                    copyDocument(user, data.state.selectedFilesForAction[0], dispatch)
                }
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                if (data.state.selectedFilesForAction.length > 1) {
                    createErrorToast('Multi document delete is not supported')
                } else if (isSharedDocumentOwned(data.state.selectedFilesForAction[0])) {
                    setModalController(prevState => ({
                        ...prevState,
                        deleteOwnedElement: data.state.selectedFilesForAction[0]
                    }))
                } else {
                    setModalController(prevState => ({
                        ...prevState,
                        deleteElement: data.state.selectedFilesForAction[0]
                    }))
                }
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
                if (data.state.selectedFilesForAction.length > 1) {
                    createErrorToast('Multi document share is not supported')
                } else {
                    setModalController(prevState => ({
                        ...prevState,
                        shareDocument: data.state.selectedFilesForAction[0]
                    }))
                }
            } else if (data.id === ManageSharedGroup.id) {
                if (data.state.selectedFilesForAction.length > 1) {
                    createErrorToast('Multi document manage share is not supported')
                } else {
                    setModalController(prevState => ({
                        ...prevState,
                        handleSharedGroup: data.state.selectedFilesForAction[0]
                    }))
                }
            } else if (data.id === RenameElement.id) {
                if (data.state.selectedFilesForAction.length > 1) {
                    createErrorToast('Multi document rename is not supported')
                } else {
                    setModalController(prevState => ({
                        ...prevState,
                        renameElement: data.state.selectedFilesForAction[0]
                    }))
                }
            }
        },
        [user, socket, setModalController, setCurrentFolderId, setDocumentToOpen, dispatch]
    )
}