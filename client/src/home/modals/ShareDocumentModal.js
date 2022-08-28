import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

import { createErrorToast } from '../../commonComponents/Toast'
import { shareDocument } from '../requests/sharingRequests'

export default function ShareDocumentModal(props) {
    const initialState = [{
        email: '',
        role: ''
    }]
    const [inputFields, setInputFields] = useState(initialState)
    const addInputField = () => {
        setInputFields([...inputFields, {
            email: '',
            role: ''
        }])
    }
    const removeInputFields = (index) => {
        inputFields.splice(index, 1)
        setInputFields(inputFields)
    }
    const resetInputFields = () => {
        setInputFields(initialState)
    }
    const handleChange = (index, event) => {
        const { name, value } = event.target
        const list = [...inputFields]
        list[index][name] = value
        setInputFields(list)
    }

    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }

    const dispatch = useDispatch()

    function tryShareDocument() {
        const isEmpty = Object.values(inputFields).every(x => (x.email === '' || x.role === ''))
        const document = props.shareDocument[0]
        if (!isEmpty) {
            shareDocument(user, inputFields, document, props, resetInputFields, dispatch)
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
                                            <Col xs={6}>
                                                <Form.Group controlId="formGridEmail">
                                                    <FloatingLabel controlId="floatingInputGrid" label="Email">
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
                                            <Col xs={5}>
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
                                            <Col xs={1} className="text-center">
                                                {(inputFields.length !== 1) ? <Button className="btn btn-danger" onClick={() => removeInputFields(index)}>-</Button> : ''}
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