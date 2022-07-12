import { FullFileBrowser, ChonkyActions } from 'chonky'
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useFiles, useFileActionHandler, useFolderChain, deleteFiles, moveFiles } from './fileSystemNavigator'

export default function Home() {
  const dispatch = useDispatch()
  let rootFolderId = useSelector(state => state.fileSystemData.rootFolderId)
  let fileMap = useSelector(state => state.fileSystemData.fileMap)

  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId)

  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useFileActionHandler(fileMap, setCurrentFolderId, deleteFiles, moveFiles, dispatch)
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
