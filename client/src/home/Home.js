import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, CreateFolder, ShareDocument, CopyDocument } from './fileSystemUtils/actions'
import { updateFileSystem, getFileSystem } from './fileSystemRequests'
import { useFiles, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
import { useActionHandler } from './fileSystemUtils/actionHandler'
import { recreateFileSystem } from './fileSystemUtils/fileSystemStructure'

import CreateFolderModal from './modals/CreateFolderModal'
import CreateDocumentModal from './modals/CreateDocumentModal'
import ShareDocumentModal from './modals/ShareDocumentModal'

export default function Home() {
  let id = useSelector(state => state.userData.id)
  let token = useSelector(state => state.userData.token)
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
      getFileSystem(id, token, dispatch)
    }, 5000);
    return () => clearInterval(interval)
  }, []);

  // Trigger redirect if a document id is set in order to open it
  useEffect(() => { if (openDocumentId !== undefined) navigate('/editor', { state: { documentId: openDocumentId } }) }, [openDocumentId, navigate])

  // Trigger used to update the file system on the server when something changes
  useEffect(() => {
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    // Calling HTTP request
    updateFileSystem(id, token, fileSystem)
  }, [rootFolderId, fileMap, id, token])

  // Initialize data for the file system library
  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useActionHandler(
    id,
    token,
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

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain} />
      <CreateFolderModal show={createFolderModalShow} onHide={() => setCreateFolderModalShow(false)} currentFolderId={currentFolderId} />
      <CreateDocumentModal show={createDocumentModalShow} onHide={() => setCreateDocumentModalShow(false)} currentFolderId={currentFolderId} />
      <ShareDocumentModal show={shareDocument !== undefined} onHide={() => setShareDocument(undefined)} shareDocument={shareDocument} />
    </div>
  )
}
