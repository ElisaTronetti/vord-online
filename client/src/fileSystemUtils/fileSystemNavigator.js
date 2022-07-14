import { ChonkyActions, FileHelper } from 'chonky'
import { useMemo, useCallback } from 'react'
import { deleteFiles, moveFiles } from './modifyFileSystem'
import { CreateDocument } from './actions'

// Configure file for the file system
export const useFiles = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== null && currentFolderId !== null) {
            const currentFolder = fileMap[currentFolderId]
            const childrenIds = currentFolder.childrenIds
            const files = childrenIds.map(function (fileId) { return fileMap[fileId] })
            return files
        }
        return []
    }, [currentFolderId, fileMap])
}

// Check the action and perform the specified function
export const useFileActionHandler = (fileMap, setCreateFolderModalShow, setCreateDocumentModalShow, setCurrentFolderId, setDocumentId, dispatch) => {
    return useCallback(
        data => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload
                const fileToOpen = targetFile ?? files[0]
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id)
                } else if (fileToOpen) {
                    console.log('Open document')
                }
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                deleteFiles(fileMap, data.state.selectedFilesForAction, dispatch)
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveFiles(
                    fileMap,
                    data.payload.files,
                    data.payload.source,
                    data.payload.destination,
                    dispatch
                )
            } else if (data.id === ChonkyActions.CreateFolder.id) {
                // Show modal to create a new folder
                setCreateFolderModalShow(true)
            } else if (data.id === CreateDocument.id) {
                setCreateDocumentModalShow(true)
            }
        },
        [fileMap, setCurrentFolderId, setCreateDocumentModalShow, setCreateFolderModalShow, dispatch]
    )
}

// Handle folder chain
export const useFolderChain = (fileMap, currentFolderId) => {
    return useMemo(() => {
        const currentFolder = fileMap[currentFolderId]
        const folderChain = [currentFolder]
        let parentId = currentFolder.parentId
        while (parentId) {
            const parentFile = fileMap[parentId]
            if (parentFile) {
                folderChain.unshift(parentFile)
                parentId = parentFile.parentId
            } else {
                parentId = null
            }
        }
        return folderChain
    }, [currentFolderId, fileMap])
}
