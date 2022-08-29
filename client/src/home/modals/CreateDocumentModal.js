import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import DefaultButton from '../../commonComponents/DefaultButton'

import { createNewDocument } from '../requests/documentRequests'
import { createErrorToast } from '../../commonComponents/Toast'

export default function CreateDocumentModal(props) {
    const [inputDocumentName, setInputDocumentName] = useState('')
    const dispatch = useDispatch()
    const inputRef = useRef()
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }

    function tryCreateDocument() {
        if (inputDocumentName.trim() !== '') {
            // Trigger HTTP request to create document in the list of documents and in the filesystem
            createNewDocument(user, props.currentFolderId, inputDocumentName, dispatch)
            setInputDocumentName('')
            props.onHide()
        } else {
            createErrorToast('Insert a non empty document name')
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={() => {props.onHide(); setInputDocumentName('') }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => { inputRef.current.focus() }}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formDocumentName">
                        <Form.Control
                            ref={inputRef}
                            onChange={input => setInputDocumentName(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryCreateDocument() } }}
                            placeholder="Enter new document name" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <DefaultButton onClick={tryCreateDocument} text={'Save'}/>
            </Modal.Footer>
        </Modal>
    )
}