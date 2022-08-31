import { useEffect, useState, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { LinkContainer } from 'react-router-bootstrap'

import { SocketContext } from '../util/socketContext'
import { DefaultButton } from '../commonComponents/buttons/Buttons'
import { createErrorToast } from '../commonComponents/Toast'
import { userLogin } from './authenticationRequests'
import './Authentication.css'

export default function Login() {
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')

    const socket = useContext(SocketContext)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    function tryLogin() {
        if (inputEmail.trim() !== '' && inputPassword.trim() !== '') {
            // HTTP request to try the login
            userLogin(inputEmail, inputPassword, dispatch, socket)
        } else {
            createErrorToast('Missing required data')
        }
    }

    // Trigger redirect if the token changes and it is not null
    let token = useSelector(state => state.userData.token)
    useEffect(() => { if (token !== null) navigate('/home') }, [token, navigate])

    return (
        <div className="auth-background">
            <Container>
                <Row className="justify-content-center">
                    <div className="form-background my-5 container col-lg-3 col-9">
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
                            <div className="text-center">
                                <DefaultButton variant="primary" onClick={tryLogin} text={"Login"} />
                                <p>Not a member?
                                    <LinkContainer to="/signup">
                                        <span className='link'>Register</span>
                                    </LinkContainer>
                                </p>
                            </div>
                        </Form>
                    </div>
                </Row>
            </Container>
        </div>
    )
}