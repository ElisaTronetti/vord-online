import { Form, Col, Row, FloatingLabel } from 'react-bootstrap'
import { DeleteButton } from '../../../commonComponents/buttons/Buttons'

export default function ManageSharedGroupOwner(props) {
    return (
        <div>
            {props.sharedGroup.map((data, index) => {
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
                                        value={role}
                                        name="role"
                                        disabled>
                                        <option></option>
                                        <option value="1">Read Only</option>
                                        <option value="2">Editor</option>
                                        <option value="3">Owner</option>
                                    </Form.Select>
                                </FloatingLabel>
                            </Form.Group>
                        </Col>
                        <Col xs={1} className="text-center">
                            {(props.sharedGroup.length === 0) ? <DeleteButton text={"-"}/> : ''}
                        </Col>
                    </Row>
                )
            })
            }
        </div>
    )
}