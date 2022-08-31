import Navbar from "react-bootstrap/Navbar"
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useSelector, useDispatch } from 'react-redux'
import { useContext } from 'react'
import { resetUser } from '../../redux/userData/actions'
import { SocketContext } from '../../util/socketContext'
import { resetFileSystem } from '../../redux/fileSystemData/actions'
import { LinkContainer } from 'react-router-bootstrap'

import { logoutUser } from "../../util/socketCommunication"

import './CustomNavbar.css'

export default function CustomNavbar() {
  const dispatch = useDispatch()
  const socket = useContext(SocketContext)
  const user = {
    id: useSelector(state => state.userData.id),
    token: useSelector(state => state.userData.token)
  }

  function logout() {
    dispatch(resetUser())
    dispatch(resetFileSystem())
    logoutUser(socket, user.id)
  }

  return (
    <Navbar collapseOnSelect expand="lg" variant="light" className="color-nav">
      <Container fluid>
        <Navbar.Brand>
          {user.token !== null && (
            <LinkContainer to='/home'>
              <Nav.Link><img height="70" className="align-center" alt="logo" src='/logo_vord.png' /></Nav.Link>
            </LinkContainer>
          )}
          {user.token === null && (
            <img height="70" className="align-center" alt="logo" src='/logo_vord.png' />
          )}
        </Navbar.Brand>
        {
          user.token !== null && (
            <>
              <Navbar.Toggle aria-controls="navbarScroll" />
              <Navbar.Collapse id="navbarScroll" className="justify-content-end">
                <Nav navbarScroll>
                  <LinkContainer to='/home'>
                    <Nav.Link>home</Nav.Link>
                  </LinkContainer>
                  <LinkContainer to="/">
                    <Nav.Link onClick={logout}> logout</Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
      </Container>
    </Navbar>
  )
}