import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, CreateFolder, ShareDocument, CopyDocument } from './fileSystemUtils/actions'
import { getFileSystem, updateFileSystem } from './fileSystemRequests'
import { useFiles, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
import { useActionHandler } from './fileSystemUtils/actionHandler'
import { SocketContext } from '../util/socketContext'
import { recreateFileSystem } from './fileSystemUtils/fileSystemStructure'

import CreateFolderModal from './modals/CreateFolderModal'
import CreateDocumentModal from './modals/CreateDocumentModal'
import ShareDocumentModal from './modals/ShareDocumentModal'

export default function Home() {
  const user = {
    id: useSelector(state => state.userData.id),
    token: useSelector(state => state.userData.token)
  }
  const fileSystem = {
    rootFolderId: useSelector(state => state.fileSystemData.rootFolderId),
    fileMap: useSelector(state => state.fileSystemData.fileMap)
  }

  const socket = useContext(SocketContext)

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [currentFolderId, setCurrentFolderId] = useState(fileSystem.rootFolderId)
  const [openDocument, setDocumentToOpen] = useState(undefined)
  const [shareDocument, setShareDocument] = useState(undefined)
  const [createFolderModalShow, setCreateFolderModalShow] = useState(false)
  const [createDocumentModalShow, setCreateDocumentModalShow] = useState(false)

  useEffect(() => {
    updateFileSystem(user, recreateFileSystem(fileSystem.rootFolderId, fileSystem.fileMap))
    // Ask periodically for the file system update
    const interval = setInterval(() => {
      getFileSystem(user, dispatch)
    }, 5000)
    return () => clearInterval(interval)
  })

  // Trigger redirect if a document id is set in order to open it
  useEffect(() => { if (openDocument !== undefined) navigate('/editor', { state: { document: openDocument } }) }, [openDocument, navigate])

  // Initialize data for the file system library
  const files = useFiles(fileSystem.fileMap, currentFolderId)
  const handleFileAction = useActionHandler(
    user,
    fileSystem,
    socket,
    setCreateFolderModalShow,
    setCreateDocumentModalShow,
    setShareDocument,
    setCurrentFolderId,
    setDocumentToOpen,
    dispatch)
  const folderChain = useFolderChain(fileSystem.fileMap, currentFolderId)

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
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain} disableDefaultFileActions={actionsToDisable} />
      <CreateFolderModal show={createFolderModalShow} onHide={() => setCreateFolderModalShow(false)} currentFolderId={currentFolderId} />
      <CreateDocumentModal show={createDocumentModalShow} onHide={() => setCreateDocumentModalShow(false)} currentFolderId={currentFolderId} />
      <ShareDocumentModal show={shareDocument !== undefined} onHide={() => setShareDocument(undefined)} shareDocument={shareDocument} />
    </div>
  )
}
