import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, CreateFolder, ShareDocument, CopyDocument } from './fileSystemUtils/actions'
import { getFileSystem } from './fileSystemRequests'
import { useFiles, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
import { useActionHandler } from './fileSystemUtils/actionHandler'

import CreateFolderModal from './modals/CreateFolderModal'
import CreateDocumentModal from './modals/CreateDocumentModal'
import ShareDocumentModal from './modals/ShareDocumentModal'

export default function Home() {
  const user = {
    id: useSelector(state => state.userData.id),
    token: useSelector(state => state.userData.token)
  }
  let rootFolderId = useSelector(state => state.fileSystemData.rootFolderId)
  let fileMap = useSelector(state => state.fileSystemData.fileMap)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentFolderId, setCurrentFolderId] = useState(rootFolderId)
  const [openDocumentId, setOpenDocumentId] = React.useState(undefined)
  const [shareDocument, setShareDocument] = React.useState(undefined)
  const [createFolderModalShow, setCreateFolderModalShow] = React.useState(false)
  const [createDocumentModalShow, setCreateDocumentModalShow] = React.useState(false)
  
  useEffect(() => {
    // Ask periodically for the file system update
    const interval = setInterval(() => {
      getFileSystem(user, dispatch)
    }, 5000);
    return () => clearInterval(interval)
  })

  // Trigger redirect if a document id is set in order to open it
  useEffect(() => { if (openDocumentId !== undefined) navigate('/editor', { state: { documentId: openDocumentId } }) }, [openDocumentId, navigate])

  // Initialize data for the file system library
  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useActionHandler(
    user,
    rootFolderId,
    fileMap,
    setCreateFolderModalShow,
    setCreateDocumentModalShow,
    setShareDocument,
    setCurrentFolderId,
    setOpenDocumentId,
    dispatch)
  const folderChain = useFolderChain(fileMap, currentFolderId)

  // Initialize actions
  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles, CreateFolder, CreateDocument, ShareDocument, CopyDocument],
    []
  )

  const actionsToDisable = [
    ChonkyActions.SelectAllFiles.id,
    ChonkyActions.SortFilesBySize.id,
    ChonkyActions.SortFilesByDate.id,
    ChonkyActions.ToggleHiddenFiles.id,
  ]

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain} disableDefaultFileActions={actionsToDisable}/>
      <CreateFolderModal show={createFolderModalShow} onHide={() => setCreateFolderModalShow(false)} currentFolderId={currentFolderId} />
      <CreateDocumentModal show={createDocumentModalShow} onHide={() => setCreateDocumentModalShow(false)} currentFolderId={currentFolderId} />
      <ShareDocumentModal show={shareDocument !== undefined} onHide={() => setShareDocument(undefined)} shareDocument={shareDocument} />
    </div>
  )
}
