export const setRootFolderId = (rootFolderId) => {
    return {
        type: "SET_ROOT_FOLDER_ID",
        payload: rootFolderId
    }
}

export const setFileMap = (fileMap) => {
    return {
        type: "SET_FILE_MAP",
        payload: fileMap
    }
}

export const resetFileSystem = () => {
    return {
        type: "RESET_FILE_SYSTEM"
    }
}