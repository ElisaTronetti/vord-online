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
    const removeNewUsers = (index) => {
        inputFields.splice(index, 1)
        setInputFields(inputFields)
        props.updateData(inputFields, sharedGroupData)
    }
    const removeOldUsers = (index) => {
        sharedGroupData.sharedGroup.splice(index, 1)
        setSharedGroupData({
            user: sharedGroupData.user,
            sharedGroup: sharedGroupData.sharedGroup
        })
        props.updateData(inputFields, sharedGroupData)
    }
    const handleNewUsersChange = (index, event) => {
        const { name, value } = event.target
        const list = [...inputFields]
        list[index][name] = value
        setInputFields(list)
        props.updateData(inputFields, sharedGroupData)
    }
    const handleOldUsersChange = (index, event) => {
        const { name, value } = event.target
        const list = [...sharedGroupData.sharedGroup]
        list[index][name] = value
        setSharedGroupData({
            user: sharedGroupData.user,
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
                            <Col xs={6}>
                                <Form.Group controlId="formGridEmail">
                                    <FloatingLabel controlId="floatingInputGrid" label="Email">
                                        <Form.Control
                                            type="email"
                                            value={email}
                                            name="email"
                                            disabled
                                        />
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
                            <Col xs={1} className="text-center">
                                <Button className="btn btn-danger" onClick={() => removeOldUsers(index)}>-</Button>
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
                                <Col xs={6}>
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
                                <Col xs={5}>
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
                                <Col xs={1} className="text-center">
                                    <Button className="btn btn-danger" onClick={() => removeNewUsers(index)}>-</Button>
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