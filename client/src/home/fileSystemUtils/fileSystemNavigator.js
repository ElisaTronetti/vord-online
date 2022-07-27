import { useMemo } from 'react'

// Configure file for the file system
export const useFiles = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== undefined && currentFolderId !== undefined) {
            const currentFolder = fileMap[currentFolderId]
            const childrenIds = currentFolder.childrenIds
            const files = childrenIds.map(function (fileId) { return fileMap[fileId] })
            return files
        }
        return []
    }, [currentFolderId, fileMap])
}

// Handle folder chain
export const useFolderChain = (fileMap, currentFolderId) => {
    return useMemo(() => {
        if (fileMap !== undefined && currentFolderId !== undefined) {
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
        }
        return []
    }, [currentFolderId, fileMap])
}
