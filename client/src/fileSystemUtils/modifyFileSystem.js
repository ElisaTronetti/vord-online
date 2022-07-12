import { setFileMap } from '../redux/fileSystemData/actions'
import { __assign, __spreadArray } from './dataStructureUtils'

export const deleteFiles = (fileMap, files, dispatch) => {
    // Create a copy of the file map to make sure we don't mutate it
    const newFileMap = { ...fileMap }
    files.forEach((file) => {
        // Delete file from the file map
        delete newFileMap[file.id]
        // Update the parent folder to make sure it doesn't try to load the file just deleted
        if (file.parentId && newFileMap[file.parentId] !== null) {
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
