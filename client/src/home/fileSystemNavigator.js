import { ChonkyActions, FileHelper } from 'chonky'
import { useMemo, useCallback } from 'react'
import { setFileMap } from '../redux/fileSystemData/actions'

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

export const useFileActionHandler = (fileMap, setCurrentFolderId, deleteFiles, moveFiles, dispatch) => {
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
                deleteFiles(fileMap, data.state.selectedFilesForAction, dispatch)
                return
            } else if (data.id === ChonkyActions.MoveFiles.id) {
                moveFiles(
                    fileMap,
                    data.payload.files,
                    data.payload.source,
                    data.payload.destination,
                    dispatch
                )
                return
            }
        },
        [fileMap, deleteFiles, setCurrentFolderId, moveFiles]
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
                parentId = null
            }
        }
        return folderChain
    }, [currentFolderId, fileMap])
}

export const deleteFiles = (fileMap, files, dispatch) => {
    // Create a copy of the file map to make sure we don't mutate it
    const newFileMap = { ...fileMap }
    files.forEach((file) => {
        // Delete file from the file map
        delete newFileMap[file.id]
        // Update the parent folder to make sure it doesn't try to load the file just deleted
        if (file.parentId && newFileMap[file.parentId !== null]) {
            const parent = newFileMap[file.parentId]
            var newChildrenIds = parent.childrenIds.filter(function (id) { return id !== file.id })
            newFileMap[file.parentId] = {
                ...parent,
                childrenIds: newChildrenIds,
                childrenCount: newChildrenIds.length,
            }
        }
        dispatch(setFileMap(newFileMap))
    })
}

export const moveFiles = (fileMap, files, source, destination, dispatch) => {
    const newFileMap = { ...fileMap }
    const moveFileIds = new Set(files.map((f) => f.id))
    // Delete files from their source folder
    var newSourceChildrenIds = source.childrenIds.filter(function (id) { return !moveFileIds.has(id) })
    newFileMap[source.id] = __assign(__assign({}, source), { childrenIds: newSourceChildrenIds, childrenCount: newSourceChildrenIds.length })
    // Add the files to their destination folder
    var newDestinationChildrenIds = __spreadArray(__spreadArray([], destination.childrenIds, true), files.map(function (f) { return f.id }), true)
    newFileMap[destination.id] = __assign(__assign({}, destination), { childrenIds: newDestinationChildrenIds, childrenCount: newDestinationChildrenIds.length })
    // Finally, update the parent folder ID on the files from source folder
    // ID to the destination folder ID.
    files.forEach(function (file) {
        newFileMap[file.id] = __assign(__assign({}, file), { parentId: destination.id })
    })
    dispatch(setFileMap(newFileMap))
}

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i]
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p]
        }
        return t
    }
    return __assign.apply(this, arguments)
}

var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i)
            ar[i] = from[i]
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from))
}