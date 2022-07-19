import { FullFileBrowser, ChonkyActions } from 'chonky'
import React, { useState, useMemo, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { CreateDocument, ShareDocument } from './fileSystemUtils/actions'
import { updateFileSystem } from './fileSystemRequests'
import { useFiles, useFileActionHandler, useFolderChain } from './fileSystemUtils/fileSystemNavigator'
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
  const [documentId, setDocumentId] = React.useState(undefined)
  const [createFolderModalShow, setCreateFolderModalShow] = React.useState(false)
  const [createDocumentModalShow, setCreateDocumentModalShow] = React.useState(false)
  const [shareDocumentModalShow, setShareDocumentModalShow] = React.useState(false)
  
  // Trigger redirect if a document id is set
  useEffect(() => { if (documentId !== undefined) navigate('/editor', { state: {documentId: documentId} }) }, [documentId, navigate])

  // Trigger used to update the file system on the server when something changes
  useEffect(() => {
    let fileSystem = recreateFileSystem(rootFolderId, fileMap)
    // Calling HTTP request
    updateFileSystem(id, token, fileSystem)
  }, [rootFolderId, fileMap, id, token])

  // Initialize data for the file system library
  const files = useFiles(fileMap, currentFolderId)
  const handleFileAction = useFileActionHandler(
    id,
    token,
    fileMap, 
    setCreateFolderModalShow,
    setCreateDocumentModalShow,
    setShareDocumentModalShow,
    setCurrentFolderId,
    setDocumentId,
    dispatch)
  const folderChain = useFolderChain(fileMap, currentFolderId)

  // Initialize actions
  const fileActions = useMemo(
    () => [ChonkyActions.DeleteFiles, ChonkyActions.CreateFolder, CreateDocument, ShareDocument],
    []
  )

  return (
    <div style={{ height: '100vh' }}>
      <FullFileBrowser files={files} fileActions={fileActions} onFileAction={handleFileAction} folderChain={folderChain} />
      <CreateFolderModal show={createFolderModalShow} onHide={() => setCreateFolderModalShow(false)} currentFolderId={currentFolderId} />
      <CreateDocumentModal show={createDocumentModalShow} onHide={() => setCreateDocumentModalShow(false)} currentFolderId={currentFolderId} />
      <ShareDocumentModal show={shareDocumentModalShow} onHide={() => setShareDocumentModalShow(false)} />
    </div>
  )
}
