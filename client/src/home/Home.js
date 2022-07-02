import { FullFileBrowser } from 'chonky'
import { useState } from 'react'

import { useFiles, useFileActionHandler, useFolderChain } from './fileSystemNavigator'

export default function Home() {
  const [currentFolderId, setCurrentFolderId] = useState("qwerty123456")
  const files = useFiles(currentFolderId)
  const handleFileAction = useFileActionHandler(setCurrentFolderId)
  const folderChain = useFolderChain(currentFolderId)
  return (
    <div style={{ height: 300 }}>
      <FullFileBrowser files={files} onFileAction={handleFileAction} folderChain={folderChain} />
    </div>
  )
}
