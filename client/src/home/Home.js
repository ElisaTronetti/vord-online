import { FullFileBrowser, ChonkyActions } from 'chonky'
import { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import Data from './data.json'

import { useFiles, useFileActionHandler, useFolderChain, deleteFiles, moveFiles } from './fileSystemNavigator'
import getFileSystem from './fileSystem'

export default function Home() {

  /*
  let id = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
  */
  const [currentFolderId, setCurrentFolderId] = useState(Data.rootFolderId)
  const [fileMap, setFileMap] = useState(Data.fileMap)

  /*useEffect(() => { 
    getFileSystem(id, token, setCurrentFolderId, setFileMap)
  }, [id, token, setCurrentFolderId, setFileMap])*/

  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useFileActionHandler(fileMap, setCurrentFolderId, setFileMap, deleteFiles, moveFiles)
  const folderChain = useFolderChain(fileMap, currentFolderId)

  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles],
    []
  )

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain}/>
    </div>
  )
}
