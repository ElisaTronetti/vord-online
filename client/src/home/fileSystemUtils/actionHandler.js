import { ChonkyActions, FileHelper } from 'chonky'
import { useCallback } from 'react'
import { deleteFiles, moveFiles, deleteDocuments, copyDocuments} from './modifyFileSystem'
import { CopyDocument, CreateDocument, ShareDocument } from './actions'
import { checkDocumentLock } from '../../util/resourcesLock'

// Check the action and perform the specified function
export const useActionHandler = (user, fileSystem, socket,
    setCreateFolderModalShow, setCreateDocumentModalShow,
    setShareDocument, setCurrentFolderId, setDocumentId, dispatch) => {
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
                        setDocumentId(fileToOpen.id)
                    } else {
                        checkDocumentLock(socket, fileToOpen.id, setDocumentId)
                    }
                }
            } else if (data.id === CopyDocument.id) {
                // Copy files
                copyDocuments(user, fileSystem, data.state.selectedFilesForAction, dispatch)
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                deleteFiles(user, fileSystem, data.state.selectedFilesForAction, dispatch)
                // Delete documents from user
                deleteDocuments(user, data.state.selectedFilesForAction)
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
        [user, fileSystem, socket, setCurrentFolderId, setShareDocument, setCreateDocumentModalShow, setCreateFolderModalShow, setDocumentId, dispatch]
    )
}