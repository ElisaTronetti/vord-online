import { Col } from "react-bootstrap"
import { Navbar, Nav } from "react-bootstrap"
import Container from 'react-bootstrap/Container'

//import logo from '../../public/logo.svg'

export default function CustomNavbar() {
  return (

      <Navbar bg="dark" variant="dark">
        <Container fluid >
          <Navbar.Brand className="mr-0 navBrand">
            <img width="70" height="70" className="d-inline-block align-top" alt="logo" src='/logo512.png' />{' '}
          </Navbar.Brand>
        </Container>
      </Navbar>

  )
}