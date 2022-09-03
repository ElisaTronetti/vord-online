import { useState, useEffect } from 'react'
import { DeleteButton, AddButton } from '../../../commonComponents/buttons/Buttons'
import { Form, Col, Row, FloatingLabel } from 'react-bootstrap'

export default function ManageSharedGroupOwner(props) {
    const [inputFields, setInputFields] = useState(props.inputFields)
    const [sharedGroupData, setSharedGroupData] = useState(props.sharedGroupData)
    const update = props.updateData

    // Added use effect to update the parent state whenever the internal state changes
    useEffect(() => {
        update(inputFields, sharedGroupData)
    }, [inputFields, sharedGroupData, update])

    const addInputField = () => {
        setInputFields([...inputFields, {
            email: '',
            role: ''
        }])
    }
    const removeNewUsers = (index) => {
        const rows = [...inputFields]
        rows.splice(index, 1)
        setInputFields(rows)
    }
    const removeOldUsers = (index) => {
        sharedGroupData.sharedGroup.splice(index, 1)
        setSharedGroupData({
            user: sharedGroupData.user,
            sharedGroup: sharedGroupData.sharedGroup
        })
    }
    const handleNewUsersChange = (index, event) => {
        const { name, value } = event.target
        const list = [...inputFields]
        list[index][name] = value
        setInputFields(list)
    }
    const handleOldUsersChange = (index, event) => {
        const { name, value } = event.target
        const list = [...sharedGroupData.sharedGroup]
        list[index][name] = value
        setSharedGroupData({
            user: sharedGroupData.user,
            sharedGroup: list
        })
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
                                <DeleteButton onClick={() => removeOldUsers(index)} text={'-'}/>
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
                                    <DeleteButton onClick={() => removeNewUsers(index)} text={'-'}/>
                                </Col>
                            </Row>
                        )
                    })
                }
            </div>
            <div>
                <AddButton onClick={addInputField} text={'Add new'}/>
            </div>
        </div>
    )
}