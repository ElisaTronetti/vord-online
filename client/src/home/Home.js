import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect, useContext } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, CreateFolder, ShareDocument, CopyDocument, ManageSharedGroup, RenameElement } from './fileSystemUtils/actions'
import { getFileSystem } from './requests/fileSystemRequests'
import { useFiles, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
import { useActionHandler } from './fileSystemUtils/actionHandler'
import { SocketContext } from '../util/socketContext'

import CreateFolderModal from './modals/CreateFolderModal'
import CreateDocumentModal from './modals/CreateDocumentModal'
import ShareDocumentModal from './modals/ShareDocumentModal'
import DeleteConfirmationModal from './modals/DeleteConfirmationModal'
import DeleteSharedModal from './modals/DeleteSharedModal'
import ManageSharedGroupModal from './modals/ManageSharedGroupModal'
import RenameElementModal from './modals/RenameElementModal'

export default function Home() {
  const user = {
    id: useSelector(state => state.userData.id),
    token: useSelector(state => state.userData.token)
  }
  const fileSystem = {
    rootFolderId: useSelector(state => state.fileSystemData.rootFolderId),
    fileMap: useSelector(state => state.fileSystemData.fileMap)
  }
  const [currentFolderId, setCurrentFolderId] = useState(fileSystem.rootFolderId)
  const [openDocument, setDocumentToOpen] = useState(undefined)
  // controller of the modals shows and hides
  const [modalController, setModalController] = useState({
    shareDocument: undefined,
    handleSharedGroup: undefined,
    deleteElement: undefined,
    deleteOwnedElement: undefined,
    createFolderModalShow: false,
    createDocumentModalShow: false,
    renameElement: undefined
  })

  const socket = useContext(SocketContext)
  const navigate = useNavigate()
  const dispatch = useDispatch()
 
  useEffect(() => {
    // Ask periodically for the file system update
    const interval = setInterval(() => {
      getFileSystem(user, dispatch)
    }, 5000)
    // Clear the interval when home component is closed
    return () => clearInterval(interval)
  })

  // Trigger redirect if a document id is set in order to open it
  useEffect(() => { if (openDocument !== undefined) navigate('/editor', { state: { document: openDocument } }) }, [openDocument, navigate])

  // Initialize data for the file system library
  const files = useFiles(fileSystem.fileMap, currentFolderId)
  const handleFileAction = useActionHandler(
    user,
    socket,
    setModalController,
    setCurrentFolderId,
    setDocumentToOpen,
    dispatch)
  const folderChain = useFolderChain(fileSystem.fileMap, currentFolderId)

  // Initialize actions
  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles, CreateFolder, CreateDocument, ShareDocument, CopyDocument, ManageSharedGroup, RenameElement],
    []
  )

  // Disable default chonky's actions that are not used in the web app
  const actionsToDisable = [
    ChonkyActions.SelectAllFiles.id,
    ChonkyActions.SortFilesBySize.id,
    ChonkyActions.SortFilesByDate.id,
    ChonkyActions.ToggleHiddenFiles.id,
  ]

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain} disableDefaultFileActions={actionsToDisable} />
      <CreateFolderModal show={modalController.createFolderModalShow} onHide={() => setModalController(prevState => ({...prevState, createFolderModalShow: false}))} currentFolderId={currentFolderId} />
      <CreateDocumentModal show={modalController.createDocumentModalShow} onHide={() => setModalController(prevState => ({...prevState, createDocumentModalShow: false}))} currentFolderId={currentFolderId} />
      <ShareDocumentModal show={modalController.shareDocument !== undefined} onHide={() => setModalController(prevState => ({...prevState, shareDocument: undefined}))} shareDocument={modalController.shareDocument} />
      <DeleteConfirmationModal show={modalController.deleteElement !== undefined} onHide={() => setModalController(prevState => ({...prevState, deleteElement: undefined}))} deleteElement={modalController.deleteElement} />
      <DeleteSharedModal show={modalController.deleteOwnedElement !== undefined} onHide={() => setModalController(prevState => ({...prevState, deleteOwnedElement: undefined}))} deleteElement={modalController.deleteOwnedElement} />
      <ManageSharedGroupModal show={modalController.handleSharedGroup !== undefined} onHide={() => setModalController(prevState => ({...prevState, handleSharedGroup: undefined}))} document={modalController.handleSharedGroup} />
      <RenameElementModal show={modalController.renameElement !== undefined} onHide={() => setModalController(prevState => ({...prevState, renameElement: undefined}))} element={modalController.renameElement} />
    </div>
  )
}