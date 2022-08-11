import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

import { getSharedGroup } from '../sharingRequests'

export default function HandleSharedGroupModal(props) {
    const initialState = [{
        email: '',
        role: ''
    }]
    const user = {
        id: useSelector(state => state.userData.id),
        token: useSelector(state => state.userData.token),
        email: useSelector(state => state.userData.email)
    }
    const [inputFields, setInputFields] = useState(initialState)

    useEffect(() => {
        if (props.document !== undefined) {
            getSharedGroup(props.document[0].id, user.id, setInputFields)
        }  
    }, [props.document, user.id])

    const removeInputFields = (index) => {
        const rows = [...inputFields]
        rows.splice(index, 1)
        setInputFields(rows)
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

    const dispatch = useDispatch()

    function modifySharedGroup() {
        console.log("AA")
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Handle shared group:</Modal.Title>
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
                                                            value={email}
                                                            name="email"
                                                            disabled
                                                        />
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
                                                            onKeyPress={event => { if (event.key === "Enter") { event.preventDefault(); modifySharedGroup() } }}>
                                                            <option></option>
                                                            <option value="1">Read Only</option>
                                                            <option value="2">Editor</option>
                                                            <option value="3">Owner</option>
                                                        </Form.Select>
                                                    </FloatingLabel>
                                                </Form.Group>
                                            </Col>
                                            <Col md={1} className="text-center">
                                                <Button className="btn btn-danger" onClick={() => removeInputFields(index)}>-</Button>
                                            </Col>
                                        </Row>
                                    )
                                })
                            }
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={modifySharedGroup}>Modify</Button>
            </Modal.Footer>
        </Modal>
    )
}