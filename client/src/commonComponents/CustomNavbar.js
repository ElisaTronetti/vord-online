import Navbar from "react-bootstrap/Navbar"
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import { useSelector, useDispatch } from 'react-redux'
import { resetUser } from '../redux/userData/actions'
import { resetFileSystem } from '../redux/fileSystemData/actions'
import { LinkContainer } from 'react-router-bootstrap'
import { RiHome2Fill } from 'react-icons/ri'
import { MdNotifications } from 'react-icons/md'
import { ImExit } from 'react-icons/im'

export default function CustomNavbar() {
  const dispatch = useDispatch()
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
                  <LinkContainer to='/home'>
                    <Nav.Link><RiHome2Fill size={40} color="white" /></Nav.Link>
                  </LinkContainer>
                  <Nav.Link><MdNotifications size={40} color="white" /></Nav.Link>
                  <LinkContainer to="/">
                    <Nav.Link><ImExit size={40} color="white" onClick={() => logout(dispatch)} /></Nav.Link>
                  </LinkContainer>
                </Nav>
              </Navbar.Collapse>
            </>
          )}
      </Container>
    </Navbar>
  )
}

function logout(dispatch) {
  dispatch(resetUser())
  dispatch(resetFileSystem())
}