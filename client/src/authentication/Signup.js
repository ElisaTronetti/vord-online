import { useState, useEffect, useContext } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Container from 'react-bootstrap/Container'
import { DefaultButton } from '../commonComponents/buttons/Buttons'
import { LinkContainer } from 'react-router-bootstrap'
import { SocketContext } from '../util/socketContext'

import './Authentication.css'
import { createWarningToast } from '../commonComponents/Toast'
import { userSignup } from './authenticationRequests'

export default function Signup() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const socket = useContext(SocketContext)

    const [inputName, setInputName] = useState('')
    const [inputSurname, setInputSurname] = useState('')
    const [inputEmail, setInputEmail] = useState('')
    const [inputPassword, setInputPassword] = useState('')
    const [inputPasswordConfirm, setInputPasswordConfirm] = useState('')

    function trySignup() {
        if (emptySignupParams()) {
            createWarningToast('Missing required data')
        } else if (inputPassword.trim() !== inputPasswordConfirm.trim()) {
            createWarningToast('Passwords do not match')
        } else {
            // HTTP request to try the signup
            userSignup(inputName, inputSurname, inputEmail, inputPassword, dispatch, socket)
        }
    }

    // Checks if there are empty params
    function emptySignupParams() {
        return inputName.trim() === '' &&
            inputSurname.trim() === '' &&
            inputEmail.trim() === '' &&
            inputPassword.trim() === '' &&
            inputPasswordConfirm.trim() === ''
    }

    // Trigger redirect if the token changes and it is not null
    let token = useSelector(state => state.userData.token)
    useEffect(() => { if (token !== null) navigate('/home') }, [token, navigate])

    return (
        <Container>
            <Row className="d-flex justify-content-center">
                <div className="my-5 container col-lg-3 col-9 border border-success rounded trnsp">
                    <Form className="mt-1 mb-3">
                        <h1 className="d-flex justify-content-center">Signup</h1>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                onChange={input => setInputName(input.target.value)}
                                onKeyPress={event => { if (event.key === "Enter") trySignup() }}
                                placeholder="Enter name" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasiSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                onChange={input => setInputSurname(input.target.value)}
                                onKeyPress={event => { if (event.key === "Enter") trySignup() }}
                                placeholder="Enter surname" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                onChange={input => setInputEmail(input.target.value)}
                                onKeyPress={event => { if (event.key === "Enter") trySignup() }}
                                placeholder="Enter email" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={input => setInputPassword(input.target.value)}
                                onKeyPress={event => { if (event.key === "Enter") trySignup() }}
                                placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formConfirmBasicPassword">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={input => setInputPasswordConfirm(input.target.value)}
                                onKeyPress={event => { if (event.key === "Enter") trySignup() }}
                                placeholder="Confirm password" />
                        </Form.Group>
                        <div className="text-center">
                            <DefaultButton variant="primary" onClick={trySignup} text={"Signup"}/>
                            <p>Already registered?
                                <LinkContainer to="/">
                                    <span className='link'>Login</span>
                                </LinkContainer>
                            </p>
                        </div>
                    </Form>
                </div>
            </Row>
        </Container>
    )
}