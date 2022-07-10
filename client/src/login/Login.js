import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'

import userLogin from './userLogin'

export default function Login() {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [inputEmail, setInputEmail] = useState(undefined)
    const [inputPassword, setInputPassword] = useState(undefined)

    function tryLogin() {
        userLogin(inputEmail, inputPassword, dispatch)
    }
    
    let token = useSelector(state => state.userData.token)
    useEffect(() => { if (token !== null) navigate('/home') })

    return (
        <Row className="d-flex justify-content-center">
            <div className="my-5 container col-lg-3 col-9 border border-success rounded trnsp">
                <Form className="mt-1 mb-3">
                    <h1 className="d-flex justify-content-center">Login</h1>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            onChange={input => setInputEmail(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") tryLogin() }}
                            placeholder="Enter email" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            onChange={input => setInputPassword(input.target.value)}
                            onKeyPress={event => { if (event.key === "Enter") tryLogin() }}
                            placeholder="Password" />
                    </Form.Group>
                    <div class="text-center">
                        <Button variant="primary" onClick={tryLogin}>Login</Button>
                        <p>Not a member? <a href="/signup">Register</a></p>
                    </div>
                </Form>
            </div>
        </Row>
    )

}
