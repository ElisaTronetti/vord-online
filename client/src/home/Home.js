import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, CreateFolder, ShareDocument, CopyDocument, ManageSharedGroup } from './fileSystemUtils/actions'
import { getFileSystem } from './requests/fileSystemRequests'
import { useFiles, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
import { useActionHandler } from './fileSystemUtils/actionHandler'
import { SocketContext } from '../util/socketContext'

import CreateFolderModal from './modals/CreateFolderModal'
import CreateDocumentModal from './modals/CreateDocumentModal'
import ShareDocumentModal from './modals/ShareDocumentModal'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal'
import HandleSharedGroupModal from './modals/HandleSharedGroup'

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
  const [handleSharedGroup, setHandleSharedGroup] = useState(undefined)
  const [deleteElements, setDeleteElements] = useState([])
  const [createFolderModalShow, setCreateFolderModalShow] = useState(false)
  const [createDocumentModalShow, setCreateDocumentModalShow] = useState(false)

  useEffect(() => {
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
    socket,
    setCreateFolderModalShow,
    setCreateDocumentModalShow,
    setDeleteElements,
    setShareDocument,
    setCurrentFolderId,
    setDocumentToOpen,
    setHandleSharedGroup,
    dispatch)
  const folderChain = useFolderChain(fileSystem.fileMap, currentFolderId)

  // Initialize actions
  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles, CreateFolder, CreateDocument, ShareDocument, CopyDocument, ManageSharedGroup],
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
      <DeleteConfirmationModal show={deleteElements.length} onHide={() => setDeleteElements([])} deleteElements={deleteElements} />
      <HandleSharedGroupModal show={handleSharedGroup !== undefined} onHide={() => setHandleSharedGroup(undefined)} document={handleSharedGroup} />
    </div>
  )
}