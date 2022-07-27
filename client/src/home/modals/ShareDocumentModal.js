import { useState } from 'react'
import { useSelector } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

import { createErrorToast } from '../../commonComponents/Toast'
import { shareLocalDocument } from '../sharingRequests'

export default function CreateDocumentModal(props) {
    const [inputFields, setInputFields] = useState([{
        email: '',
        role: ''
    }])
    const addInputField = () => {
        setInputFields([...inputFields, {
            email: '',
            role: ''
        }])
    }
    const removeInputFields = (index) => {
        const rows = [...inputFields]
        rows.splice(index, 1)
        setInputFields(rows)
    }
    const handleChange = (index, event) => {
        const { name, value } = event.target
        const list = [...inputFields]
        list[index][name] = value
        setInputFields(list)
    }

    let id = useSelector(state => state.userData.id)
    let email = useSelector(state => state.userData.email)

    function tryShareDocument() {
        const isEmpty = Object.values(inputFields).every(x => (x.email === '' || x.role === ''));
        if (!isEmpty) {
            shareLocalDocument(id, email, inputFields, props.shareDocument[0].id, props)
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
                <Container>
                    <Row>
                        <Col className='sm-8'>
                            {
                                inputFields.map((data, index) => {
                                    const { email, role } = data
                                    return (
                                        <Row className="my-2 align-items-center" key={index}>
                                            <Col>
                                                <Form.Group controlId="formGridEmail">
                                                    <FloatingLabel controlId="floatingInputGrid" label="Email address">
                                                        <Form.Control
                                                            type="email"
                                                            onChange={event => handleChange(index, event)}
                                                            value={email}
                                                            name="email"
                                                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryShareDocument() } }}
                                                            placeholder="name@example.com" />
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group controlId="formGridRole">
                                                    <FloatingLabel
                                                        controlId="floatingSelectGrid"
                                                        label="Select role">
                                                        <Form.Select
                                                            aria-label=""
                                                            onChange={event => handleChange(index, event)}
                                                            value={role}
                                                            name="role"
                                                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); tryShareDocument() } }}>
                                                            <option></option>
                                                            <option value="1">Read Only</option>
                                                            <option value="2">Editor</option>
                                                            <option value="3">Owner</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col md={1} className="text-center">
                                                {(inputFields.length !== 1) ? <Button className="btn btn-danger" onClick={removeInputFields}>-</Button> : ''}
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                            <div>
                                <Button className="btn btn-success" onClick={addInputField}>Add new</Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={tryShareDocument}>Share</Button>
            </Modal.Footer>
        </Modal>
    )
}