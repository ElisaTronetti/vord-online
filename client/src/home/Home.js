import { FullFileBrowser, ChonkyActions } from 'chonky'
import { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updateFileSystem } from '../home/fileSystem'

import { useFiles, useFileActionHandler, useFolderChain } from '../fileSystemUtils/fileSystemNavigator'

export default function Home() {
  let id = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
  let rootFolderId = useSelector(state => state.fileSystemData.rootFolderId)
  let fileMap = useSelector(state => state.fileSystemData.fileMap)

  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId)

  useEffect(() => {
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    //calling HTTP request in order to update the fileSystem when something changes
    updateFileSystem(id, token, fileSystem)
  }, [rootFolderId, fileMap, id, token])

  const dispatch = useDispatch()
  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useFileActionHandler(fileMap, setCurrentFolderId, currentFolderId, dispatch)
  const folderChain = useFolderChain(fileMap, currentFolderId)

  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles, ChonkyActions.CreateFolder],
    []
  )

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain}/>
    </div>
  )
}

function recreateFileSystem(rootFolderId, fileMap){
  return JSON.parse('{"rootFolderId":"' + rootFolderId + '", ' +
  '"fileMap":' + JSON.stringify(fileMap) + '}')
}