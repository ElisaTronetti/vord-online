import React, { useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteFiles } from '../fileSystemUtils/modifyFileSystem'
import { deleteLocalDocuments, deleteSharedDocumentsForMe, deleteSharedDocumentsForAll } from '../documentsUtils/modifyDocument'
import { SocketContext } from '../../util/socketContext'

export default function DeleteSharedModal(props) {
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
    const socket = useContext(SocketContext)

    function confirmDeleteElements(deleteForMe) {
        props.onHide()
        // If there are not owned shared files
        // Delete files from file system
        const updatedFileSystem = deleteFiles(user, fileSystem, props.localElements.concat(props.sharedDocuments), dispatch)
        // Delete local documents from user
        deleteLocalDocuments(user, props.localElements)
        // Delete shared documents
        deleteSharedDocumentsForMe(user, props.sharedDocuments)
        if (deleteForMe) {
            // Delete owned documents with correct option
            deleteFiles(user, updatedFileSystem, props.ownedDocuments, dispatch)
            deleteSharedDocumentsForMe(user, props.ownedDocuments)
        } else {
            deleteSharedDocumentsForAll(user, updatedFileSystem, props.ownedDocuments, socket, dispatch)
        }

    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title>Delete Confirmation</Modal.Title>
            </Modal.Header>
            <Modal.Body>{deleteOwnerDocumentMessage(props.ownedDocuments)}</Modal.Body>
            <Modal.Footer>
                <div>
                    <Button variant="default me-1" onClick={props.onHide}>
                        Cancel
                    </Button>
                    <Button variant="danger me-1" onClick={() => confirmDeleteElements(true)}>
                        Delete for me
                    </Button>
                    <Button variant="danger me-1" onClick={() => confirmDeleteElements(false)}>
                        Delete for all
                    </Button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

function deleteOwnerDocumentMessage(ownedDocuments) {
    let message = 'You are the owner of '
    for (let i = 0; i < ownedDocuments.length; i++) {
        message = message + '"' + ownedDocuments[0].name + '"'
        if (i === ownedDocuments.length - 1) {
            message = message + '. '
        } else {
            message = message + ', '
        }
    }
    message = message + 'You can delete ' + ((ownedDocuments.length === 1) ? 'it' : 'them')
    message = message + ' only for you or for all the shared group.'
    return message
}