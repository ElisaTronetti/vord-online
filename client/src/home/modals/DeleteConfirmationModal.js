import React from 'react'
import { Modal } from 'react-bootstrap'
import { CancelButton, DeleteButton } from '../../commonComponents/buttons/Buttons'
import { useSelector, useDispatch } from 'react-redux'
import { deleteElementForMe } from '../documentsUtils/modifyDocument'

export default function DeleteConfirmationModal(props) {
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }

    const dispatch = useDispatch()

    function confirmDeleteElement() {
        deleteElementForMe(user, props.deleteElement, dispatch)
        props.onHide()
    }

    if (props.deleteElement === undefined) {
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
                    <Modal.Body>{deleteElementMessage(props.deleteElement)}</Modal.Body>
                    <Modal.Footer>
                        <div>
                            <CancelButton onClick={props.onHide} text={'Cancel'} />
                            <DeleteButton onClick={() => confirmDeleteElement()} text={'Delete'} />
                        </div>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

function deleteElementMessage(deleteElement) {
    let message = 'Are you sure you want to permanently delete ' + deleteElement.name + '?'
    return message
}