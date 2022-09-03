import { Form, Col, Row, FloatingLabel } from 'react-bootstrap'
import { DeleteButton } from '../../../commonComponents/buttons/Buttons'

export default function ManageSharedGroupModal(props) {
    return (
        <Row className="my-2 align-items-center">
            <Col xs={6}>
                <Form.Group controlId="formGridEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Email">
                        <Form.Control
                            type="email"
                            value={props.user[0].email}
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
                        label="Selected role">
                        <Form.Select
                            aria-label=""
                            value={props.user[0].role}
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
                {(props.user.length > 1) ? <DeleteButton text={'-'}/> : ''}
            </Col>
        </Row>
    )
}