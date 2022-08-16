import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import FloatingLabel from 'react-bootstrap/FloatingLabel'
import Row from 'react-bootstrap/Row'

export default function ManageSharedGroupOwner(props) {
    return (
        <div>
            {props.sharedGroup.map((data, index) => {
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
                        <Col md={1} className="text-center">
                            {(props.sharedGroup.length === 0) ? <Button className="btn btn-danger">-</Button> : ''}
                        </Col>
                    </Row>
                )
            })
            }
        </div>
    )
}