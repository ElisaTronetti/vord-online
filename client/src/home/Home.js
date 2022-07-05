import { FullFileBrowser } from 'chonky'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import Data from './data.json'

import { useFiles, useFileActionHandler, useFolderChain } from './fileSystemNavigator'
import getFileSystem from './fileSystem'

export default function Home() {
  //var fileMap = Data.fileMap (to test with json file)
  
  let id = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)

  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [fileMap, setFileMap] = useState(null)

  useEffect(() => { 
    getFileSystem(id, token, setCurrentFolderId, setFileMap)
  }, [id, token, setCurrentFolderId, setFileMap])

  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useFileActionHandler(setCurrentFolderId)
  const folderChain = useFolderChain(fileMap, currentFolderId)

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} onFileAction={handleFileAction} folderChain={folderChain} />
    </div>
  )
}
