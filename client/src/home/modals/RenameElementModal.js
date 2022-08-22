import { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { createWarningToast } from '../../commonComponents/Toast'
import { renameElement } from '../requests/fileSystemRequests'

export default function RenameElementModal(props) {
    const [inputName, setInputName] = useState('')
    const dispatch = useDispatch()
    const inputRef = useRef()
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token)
    }

    useEffect(() => {
        if (props.element !== undefined) {
            setInputName(props.element.name)
        }
    }, [props.element])

    function tryRenameElement() {
        if (inputName.trim() === '') {
            createWarningToast('The name can not be empty')
        } else if (inputName.trim() === props.element.name) {
            props.onHide()
        } else {
            renameElement(user, props.element, inputName, dispatch, props)
        }
    }

    if (props.element === undefined) {
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
                centered
                onShow={() => { inputRef.current.focus() }}>
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">{'Rename ' + props.element.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formFolderName">
                            <Form.Label>{'You can rename ' + props.element.name + ' by writing the new name below'}</Form.Label>
                            <Form.Control
                                ref={inputRef}
                                onChange={input => setInputName(input.target.value)}
                                value={inputName}
                                onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryRenameElement() } }}
                                placeholder="Enter new name" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={tryRenameElement}>Save</Button>
                </Modal.Footer>
            </Modal>
        )
    }
}