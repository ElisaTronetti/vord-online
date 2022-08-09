import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteFiles } from '../fileSystemUtils/modifyFileSystem'
import { deleteLocalDocuments, deleteSharedDocuments } from '../documentsUtils/modifyDocument'

import DeleteSharedModal from './DeleteSharedModel'

export default function DeleteConfirmationModal(props) {
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }
    const fileSystem = {
        rootFolderId: useSelector(state => state.fileSystemData.rootFolderId),
        fileMap: useSelector(state => state.fileSystemData.fileMap)
    }

    const dispatch = useDispatch()
    const [showOwnedDocumentsDeleteOptions, setShowOwnedDocumentsDeleteOptions] = useState(undefined)
    const sharedDocuments = props.deleteElements.filter(isSharedDocument).filter(d => !isOwner(d))
    const ownedDocuments = props.deleteElements.filter(isSharedDocument).filter(isOwner)

    function confirmDeleteElements() {
        if (!ownedDocuments.length) {
            // If there are not owned shared files
            // Delete files from file system
            deleteFiles(user, fileSystem, props.deleteElements, dispatch)
            // Delete local documents from user
            deleteLocalDocuments(user, props.deleteElements)
            // Delete shared documents with user
            deleteSharedDocuments(user, sharedDocuments, true)
        } else {
            // Show modal to ask if the owned shared files 
            // are going to be deleted for the user or for the shared group
            setShowOwnedDocumentsDeleteOptions(true)
        }
    }

    return (
        <div>
            <Modal
                show={props.show}
                onHide={props.onHide}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>
                <Modal.Body>{deleteElementsMessage(props.deleteElements)}</Modal.Body>
                <Modal.Footer>
                    <div>
                        <Button variant="default me-1" onClick={props.onHide}>
                            Cancel
                        </Button>
                        <Button variant="danger me-1" onClick={() => confirmDeleteElements()}>
                            Delete
                        </Button>
                    </div>
                </Modal.Footer>
            </Modal>
            <DeleteSharedModal show={showOwnedDocumentsDeleteOptions} onHide={() => { props.onHide(); setShowOwnedDocumentsDeleteOptions(false) }} deleteElements={props.deleteElements} sharedDocuments={sharedDocuments} ownedDocuments={ownedDocuments} />
        </div>
    )
}

function deleteElementsMessage(deleteElements) {
    let message = 'Are you sure you want to permanently delete '
    for (let i = 0; i < deleteElements.length; i++) {
        message = message + '"' + deleteElements[i].name + '"'
        if (i === deleteElements.length - 1) {
            message = message + '? '
        } else {
            message = message + ', '
        }
    }
    return message
}

function isSharedDocument(document) {
    return document.isShared
}

function isOwner(document) {
    if (document.role !== undefined) {
        return document.role === 3
    } else {
        return false
    }
}