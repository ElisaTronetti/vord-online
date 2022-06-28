import { useState } from 'react'
import { useDispatch } from 'react-redux'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import userSignup from './userSignup'

export default function Signup() {
    const dispatch = useDispatch()

    const [inputName, setInputName] = useState("")
    const [inputSurname, setInputSurname] = useState("")
    const [inputEmail, setInputEmail] = useState("")
    const [inputPassword, setInputPassword] = useState("")
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState("")

    function trySignup() {
        userSignup(inputName, inputSurname, inputEmail, inputPassword, inputPasswordConfirm, dispatch)
    }

    return (
        <Row className="d-flex justify-content-center">
            <div className="my-5 container col-lg-3 col-9 border border-success rounded trnsp">
                <Form className="mt-1 mb-3">
                    <h1 className="d-flex justify-content-center">Signup</h1>
                    <Form.Group className="mb-3" controlId="formBasicName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            onChange={input => setInputName(input.target.value)}
                            onEnter={trySignup}
                            placeholder="Enter name" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasiSurname">
                        <Form.Label>Surname</Form.Label>
                        <Form.Control
                            onChange={input => setInputSurname(input.target.value)}
                            onEnter={trySignup}
                            placeholder="Enter surname" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            onChange={input => setInputEmail(input.target.value)}
                            onEnter={trySignup}
                            placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={input => setInputPassword(input.target.value)}
                            onEnter={trySignup}
                            placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formConfirmBasicPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={input => setInputPasswordConfirm(input.target.value)}
                            onEnter={trySignup}
                            placeholder="Confirm password" />
                    </Form.Group>
                    <div class="text-center">
                        <Button variant="primary" onClick={trySignup}>Signup</Button>
                        <p className="forgot-password text-right">Already registered <a href="/">login</a></p>
                    </div>
                </Form>
            </div>
        </Row>
    )
}