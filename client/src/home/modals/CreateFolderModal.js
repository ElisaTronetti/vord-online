import { useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

import { createFolder } from '../requests/folderRequests'
import { createErrorToast } from '../../commonComponents/Toast'

export default function CreateFolderModal(props) {
    const [inputFolderName, setInputFolderName] = useState('')
    const dispatch = useDispatch()
    const inputRef = useRef()
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }

    function tryCreateFolder() {
        if (inputFolderName.trim() !== '') {
            createFolder(user, props.currentFolderId, inputFolderName, dispatch)
            setInputFolderName('')
            props.onHide()
        } else {
            createErrorToast('Insert a non empty folder name')
        }
    }

    return (
        <Modal
            show={props.show}
            onHide={() => { props.onHide(); setInputFolderName('') }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onShow={() => { inputRef.current.focus() }}>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Create folder</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formFolderName">
                        <Form.Control
                            ref={inputRef}
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