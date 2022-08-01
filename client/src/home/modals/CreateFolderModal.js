import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { createFolder } from '../fileSystemUtils/modifyFileSystem'

export default function CreateFolderModal(props) {
    const [inputFolderName, setInputFolderName] = useState("")
    const dispatch = useDispatch()

    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }
    const fileSystem = {
        rootFolderId: useSelector(state => state.fileSystemData.rootFolderId),
        fileMap: useSelector(state => state.fileSystemData.fileMap)
    }

    function tryCreateFolder() {
        if (inputFolderName !== "") {
            createFolder(user, fileSystem, props.currentFolderId, inputFolderName, dispatch)
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
                <Modal.Title id="contained-modal-title-vcenter">Create folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formFolderName">
                        <Form.Label>Folder name</Form.Label>
                        <Form.Control
                            autoFocus
                            onChange={input => setInputFolderName(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryCreateFolder() } }}
                            placeholder="Enter new folder name" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={tryCreateFolder}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
}