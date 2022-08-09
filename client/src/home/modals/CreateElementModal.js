import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import ObjectID from 'bson-objectid'

import { createDocument } from '../fileSystemUtils/modifyFileSystem'
import { createNewDocument } from '../documentsUtils/documentRequests'
import { createFolder } from '../fileSystemUtils/modifyFileSystem'

export default function CreateElementModal(props) {
    const [inputName, setInputName] = useState("")
    const inputRef = useRef()
    const dispatch = useDispatch()
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }
    const fileSystem = {
        rootFolderId: useSelector(state => state.fileSystemData.rootFolderId),
        fileMap: useSelector(state => state.fileSystemData.fileMap)
    }

    function tryCreateDocument() {
        if (inputName !== "") {
            let documentId = ObjectID().toHexString()
            // Create document in the file system
            createDocument(user, fileSystem, props.currentFolderId, documentId, inputName, dispatch)
            // Trigger HTTP request to create document in the list of documents in the server
            createNewDocument(user, documentId, inputName)
            props.onHide()
        }
    }

    function tryCreateFolder() {
        if (inputName !== "") {
            createFolder(user, fileSystem, props.currentFolderId, inputName, dispatch)
            props.onHide()
        }
    }

    /*function elementTypeCreation() {
        if (props.type === 'folder') {
            tryCreateFolder()
        } else if (props.type === 'document') {
            tryCreateDocument()
        }
    }*/
    

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => { inputRef.current.focus() }}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">{'Create ' + props.type}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formFolderName">
                        <Form.Control
                            ref={inputRef}
                            onChange={input => setInputName(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryCreateFolder() } }}
                            placeholder={"Enter new " + props.type + " name"} />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={(props.isFolder ? tryCreateFolder : tryCreateDocument())}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}
