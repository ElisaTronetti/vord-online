import React, { useContext } from 'react'
import { Modal } from 'react-bootstrap'
import { CancelButton, DeleteButton } from '../../commonComponents/buttons/Buttons'
import { useSelector, useDispatch } from 'react-redux'
import { deleteElementForMe, deleteElementForAll } from '../documentsUtils/modifyDocument'
import { SocketContext } from '../../util/socketContext'

export default function DeleteSharedModal(props) {
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }
    const dispatch = useDispatch()
    const socket = useContext(SocketContext)

    function confirmDeleteElement(deleteForMe) {
        props.onHide()
        if (deleteForMe) {
            deleteElementForMe(user, props.deleteElement, dispatch)
        } else {
            deleteElementForAll(user, props.deleteElement, socket, dispatch)
        }
    }

    if (props.deleteElement === undefined){
        return (
            <div></div>
        )
    } else {
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
                <Modal.Body>{deleteOwnerDocumentMessage(props.deleteElement)}</Modal.Body>
                <Modal.Footer>
                    <div>
                        <CancelButton onClick={props.onHide} text={'Cancel'}/>
                        <DeleteButton onClick={() => confirmDeleteElement(true)} text={'Delete for me'}/>
                        <DeleteButton onClick={() => confirmDeleteElement(false)} text={'Delete for all'}/>
                    </div>
                </Modal.Footer>
            </Modal>
        )
    }
}

function deleteOwnerDocumentMessage(ownedDocument) {
    let message = 'You are the owner of ' + ownedDocument.name + '.'
    message = message + 'You can delete it only for you or for all the shared group.'
    return message
}