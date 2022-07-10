import { ChonkyActions, FileHelper } from 'chonky'
import { useMemo, useCallback } from 'react'

export const useFiles = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== null && currentFolderId !== null) {
            const currentFolder = fileMap[currentFolderId]
            const childrenIds = currentFolder.childrenIds
            const files = childrenIds.map(function (fileId) { return fileMap[fileId]; });
            return files
        }
        return []
    }, [currentFolderId, fileMap])
}

export const useFileActionHandler = (fileMap, setCurrentFolderId, setFileMap, deleteFiles) => {
    return useCallback(
        data => {
            console.log()
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload
                const fileToOpen = targetFile ?? files[0]
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id)
                    return
                }
            } else if (data.id === ChonkyActions.DeleteFiles.id) {
                deleteFiles(fileMap, data.state.selectedFilesForAction, setFileMap)
                return
            }
        },
        [fileMap, deleteFiles, setCurrentFolderId, setFileMap]
    )
}

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
                parentId = null;
            }
        }
        return folderChain;
    }, [currentFolderId, fileMap])
}

export const deleteFiles = (fileMap, files, setFileMap) => {
    // Create a copy of the file map to make sure we don't mutate it
    const newFileMap = { ...fileMap }
    files.forEach((file) => {
        // Delete file from the file map
        delete newFileMap[file.id]
        // Update the parent folder to make sure it doesn't try to load the file just deleted
        if (file.parentId && newFileMap[file.parentId !== null]) {
            const parent = newFileMap[file.parentId]
            var newChildrenIds = parent.childrenIds.filter(function (id) { return id !== file.id; })
            newFileMap[file.parentId] = {
                ...parent,
                childrenIds: newChildrenIds,
                childrenCount: newChildrenIds.length,
            }
        }
        setFileMap(newFileMap)
    })
}