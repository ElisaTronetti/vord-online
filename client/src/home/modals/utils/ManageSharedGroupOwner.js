import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

export default function ManageSharedGroupOwner(props) {
    const [inputFields, setInputFields] = useState(props.inputFields)
    const [sharedGroupData, setSharedGroupData] = useState(props.sharedGroupData)

    const addInputField = () => {
        setInputFields([...inputFields, {
            email: '',
            role: ''
        }])
        props.updateData(inputFields, sharedGroupData)
    }
    const removeInputFields = (index) => {
        const rows = [...inputFields]
        rows.splice(index, 1)
        setInputFields(rows)
        props.updateData(inputFields, sharedGroupData)
    }
    const handleNewUsersChange = (index, event) => {
        const { name, value } = event.target
        const list = [...inputFields]
        list[index][name] = parseInt(value, 10)
        setInputFields(list)
        props.updateData(inputFields, sharedGroupData)
    }
    const handleOldUsersChange = (index, event) => {
        const prevUserState = [...sharedGroupData.user]
        const { name, value } = event.target
        const list = [...sharedGroupData.sharedGroup]
        list[index][name] = parseInt(value, 10)
        setSharedGroupData({
            user: prevUserState,
            sharedGroup: list
        })
        props.updateData(inputFields, sharedGroupData)
    }

    return (
        <div>
            <div>
                {sharedGroupData.sharedGroup.map((data, index) => {
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
                                            onChange={event => handleOldUsersChange(index, event)}
                                            value={role}
                                            name="role">
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
                                                onChange={event => handleNewUsersChange(index, event)}
                                                value={email}
                                                name="email"
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
                                                onChange={event => handleNewUsersChange(index, event)}
                                                value={role}
                                                name="role">
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
            </div>
            <div>
                <Button className="btn btn-success" onClick={addInputField}>Add new</Button>
            </div>
        </div>
    )
}