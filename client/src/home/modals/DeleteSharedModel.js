import React from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteFiles } from '../fileSystemUtils/modifyFileSystem'
import { deleteLocalDocuments, deleteSharedDocuments } from '../documentsUtils/modifyDocument'

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

    function confirmDeleteElements(deleteForMe) {
        props.onHide()
        // If there are not owned shared files
        // Delete files from file system
        deleteFiles(user, fileSystem, props.deleteElements, dispatch)
        // Delete local documents from user
        deleteLocalDocuments(user, props.deleteElements)
        // Delete shared documents
        deleteSharedDocuments(user, props.sharedDocuments, true)
        // Delete owned documents with correct option
        deleteSharedDocuments(user, props.ownedDocuments, deleteForMe)
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}>
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