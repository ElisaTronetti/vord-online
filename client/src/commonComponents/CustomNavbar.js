import Navbar from "react-bootstrap/Navbar"
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { RiHome2Fill } from 'react-icons/ri'
import { MdNotifications } from 'react-icons/md'
import { ImExit } from 'react-icons/im'

export default function CustomNavbar() {
  let token = useSelector(state => state.userData.token)

  return (
    <Navbar bg="dark" variant="dark">
      <Container fluid >
        <Navbar.Brand>
          <img width="70" height="70" className="align-center" alt="logo" src='/logo512.png' />{' '}
        </Navbar.Brand>
        {
          token !== null && (
            <>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse className="justify-content-end">
                <Nav>
                  <Link to='/home'><RiHome2Fill size={40} color="white" /></Link>
                  <MdNotifications size={40} color="white" />
                  <ImExit size={40} color="white" />
                </Nav>
              </Navbar.Collapse>
            </>
          )}
      </Container>
    </Navbar>
  )
}