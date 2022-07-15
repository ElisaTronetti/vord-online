import { Col } from "react-bootstrap"
import { Navbar, Nav } from "react-bootstrap"
import Container from 'react-bootstrap/Container'

//import logo from '../../public/logo.svg'

export default function CustomNavbar() {
  return (

      <Navbar bg="dark" variant="dark">
        <Container fluid >
          <div>
          <Navbar.Brand>
            <img width="30%" height="30%" className="align-center" alt="logo" src='/full_logo.png' />{' '}  
          </Navbar.Brand>
          </div>
          
        </Container>
      </Navbar>

  )
}