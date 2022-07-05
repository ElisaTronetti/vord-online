import { ChonkyActions, FileHelper } from 'chonky'
import { useMemo, useCallback } from 'react'

export const useFiles = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== null && currentFolderId !== null) {
            const currentFolder = fileMap[currentFolderId]
            const files = currentFolder.childrenIds
            ? currentFolder.childrenIds.map((fileId) => fileMap[fileId] ?? null)
            : []
        return files
        }
        return []
    }, [fileMap, currentFolderId])
}

export const useFileActionHandler = (setCurrentFolderId) => {
    return useCallback(
        data => {
            if (data.id === ChonkyActions.OpenFiles.id) {
                const { targetFile, files } = data.payload
                const fileToOpen = targetFile ?? files[0]
                if (fileToOpen && FileHelper.isDirectory(fileToOpen)) {
                    setCurrentFolderId(fileToOpen.id)
                    return
                }
            }
            console.log(data)
        },
        [setCurrentFolderId]
    )
}

export const useFolderChain = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== null && currentFolderId !== null) {
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
        }
        return []
    }, [fileMap, currentFolderId])
}