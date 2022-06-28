import { useState } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import userLogin from './userLogin'

export default function Login() {
    const [inputEmail, setInputEmail] = useState(undefined)
    const [inputPassword, setInputPassword] = useState(undefined)

    function tryLogin() {
        userLogin(inputEmail, inputPassword)
    }

    return (
        <Row className="d-flex justify-content-center">
            <div className="my-5 container col-lg-3 col-9 border border-success rounded trnsp">
                <Form className="mt-1 mb-3">
                    <h1 className="d-flex justify-content-center">Login</h1>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label
                            onChange={input => setInputEmail(input)}
                            onEnter={tryLogin}>
                            Email address
                        </Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label
                            onChange={input => setInputPassword(input)}
                            onEnter={tryLogin}>
                            Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <div class="text-center">
                        <Button variant="primary" type="submit" onClick={tryLogin}>Login</Button>
                        <p>Not a member? <a href="/signup">Register</a></p>
                    </div>
                </Form>
            </div>
        </Row>
    )
}

/*
REDUX INTERACTIONS
<div>
    <p onClick={() => dispatch(increment())}>{counterValue}</p>
    <Button onClick={() => dispatch(setValue(42))}>Set 42</Button>
    <Button variant='danger' onClick={() => setReroute(true)}>login</Button>
</div> */