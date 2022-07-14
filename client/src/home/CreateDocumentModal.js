import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ObjectID  from 'bson-objectid'

import { createDocument } from '../fileSystemUtils/modifyFileSystem'
import { createNewDocument } from './fileSystemRequests'

export default function CreateDocumentModal(props) {
    const [inputDocumentName, setInputDocumentName] = useState("")
    const dispatch = useDispatch()
    let id = useSelector(state => state.userData.id)
    let token = useSelector(state => state.userData.token)
    let fileMap = useSelector(state => state.fileSystemData.fileMap)

    function tryCreateDocument() {
        if (inputDocumentName) {
            let documentId = ObjectID().toHexString()
            // Create document in the file system
            createDocument(fileMap, props.currentFolderId, documentId, inputDocumentName, dispatch)
            // Trigger HTTP request to create document in the list of documents in the server
            createNewDocument(id, token, documentId, inputDocumentName)
            props.onHide()
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
                <Modal.Title id="contained-modal-title-vcenter">Create document</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formFolderName">
                        <Form.Label>Document name</Form.Label>
                        <Form.Control
                            autoFocus
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