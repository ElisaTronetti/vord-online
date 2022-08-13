import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { createNewDocument } from '../requests/documentRequests'

export default function CreateDocumentModal(props) {
    const [inputDocumentName, setInputDocumentName] = useState("")
    const dispatch = useDispatch()
    const inputRef = useRef()
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }

    function tryCreateDocument() {
        if (inputDocumentName.trim() !== "") {
            // Trigger HTTP request to create document in the list of documents and in the filesystem
            createNewDocument(user, props.currentFolderId, inputDocumentName, dispatch)
            props.onHide()
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => { inputRef.current.focus() }}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formFolderName">
                        <Form.Label>Document name</Form.Label>
                        <Form.Control
                            ref={inputRef}
                            onChange={input => setInputDocumentName(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryCreateDocument() } }}
                            placeholder="Enter new document name" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={tryCreateDocument}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}