import { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

import { createErrorToast } from '../../commonComponents/Toast'
import { shareLocalDocument } from '../sharingRequests'

export default function CreateDocumentModal(props) {
    const [emailToShare, setEmailToShare] = useState("")
    const [inputRole, setInputRole] = useState("")
    let id = useSelector(state => state.userData.id)
    let email = useSelector(state => state.userData.email)

    function tryShareDocument() {
        if (emailToShare !== "" && inputRole !== "") {
            shareLocalDocument(id, email, emailToShare, inputRole, props.shareDocument[0].id)
            props.onHide()
        } else {
            createErrorToast('Insert all the required data')
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
                <Modal.Title id="contained-modal-title-vcenter">Share document to:</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <FloatingLabel controlId="floatingInputGrid" label="Email address">
                                <Form.Control
                                    type="email"
                                    onChange={input => setEmailToShare(input.target.value)}
                                    onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryShareDocument() } }}
                                    placeholder="name@example.com" />
                            </FloatingLabel>
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridRole">
                            <FloatingLabel
                                controlId="floatingSelectGrid"
                                label="Select role">
                                <Form.Select
                                    aria-label=""
                                    onChange={input => setInputRole(input.target.value)}
                                    onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryShareDocument() } }}>
                                    <option></option>
                                    <option value="1">Read Only</option>
                                    <option value="2">Editor</option>
                                    <option value="3">Owner</option>
                                </Form.Select>
                            </FloatingLabel>
                        </Form.Group>
                    </Row>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={tryShareDocument}>Share</Button>
            </Modal.Footer>
        </Modal>
    )
}