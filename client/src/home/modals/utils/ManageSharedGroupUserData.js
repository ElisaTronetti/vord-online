import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

export default function ManageSharedGroupModal(props) {
    return (
        <Row className="my-2 align-items-center">
            <Col>
                <Form.Group controlId="formGridEmail">
                    <FloatingLabel controlId="floatingInputGrid" label="Email address">
                        <Form.Control
                            type="email"
                            value={props.user[0].email}
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
            <Col md={1} className="text-center">
                {(props.user.length > 1) ? <Button className="btn btn-danger">-</Button> : ''}
            </Col>
        </Row>

    )
}