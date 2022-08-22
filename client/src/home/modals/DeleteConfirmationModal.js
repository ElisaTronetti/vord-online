import React, { useEffect, useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { deleteElementsForMe } from '../documentsUtils/modifyDocument'
import { isSharedDocumentOwned } from '../documentsUtils/documentUtils'

import DeleteSharedModal from './DeleteSharedModal'

export default function DeleteConfirmationModal(props) {
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }
    const [showOwnedDocumentsDeleteOptions, setShowOwnedDocumentsDeleteOptions] = useState(undefined)
    const [ownedDocuments, setOwnedDocuments] = useState(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        // Update owned documents when the props is not undefined anymore
        if (props.deleteElements !== undefined) {
            setOwnedDocuments(props.deleteElements.filter(isSharedDocumentOwned))
        }
    }, [props.deleteElements])

    function confirmDeleteElements() {
        if (!ownedDocuments.length) {
            // Delete elements
            deleteElementsForMe(user, props.deleteElements, dispatch)
            props.onHide()
        } else {
            // Show modal to ask if the owned shared files 
            // are going to be deleted for the user or for the shared group
            setShowOwnedDocumentsDeleteOptions(true)
        }
    }

    if (props.deleteElements === undefined && props.ownedDocuments === undefined) {
        return (
            <div></div>
        )
    } else {
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
                <DeleteSharedModal show={showOwnedDocumentsDeleteOptions} onHide={() => { props.onHide(); setShowOwnedDocumentsDeleteOptions(false) }} deleteElements={props.deleteElements} ownedDocuments={ownedDocuments} />
            </div>
        )
    }
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