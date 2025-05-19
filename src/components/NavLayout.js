import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import tag from "../image/logo.png";
import { LinkContainer } from 'react-router-bootstrap';
import { FaBars } from "react-icons/fa"; // Add this import

function NavLayout() {
  return (
    <Navbar bg="dark" expand="lg">
      <Container fluid>
        <Navbar.Brand to="/" style={{ marginRight: '30px' }}>
          <img src={tag} width="40" height="40" alt="Stocks" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" style={{marginRight:"10px"}}>
          <FaBars size={28} color="white" />
        </Navbar.Toggle>
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <LinkContainer to="/">
              <Nav.Link href="#Home">
                <span style={{ color: "whitesmoke" }}>
                  Home
                </span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/stocks">
              <Nav.Link href="#stocks">
                <span style={{ color: "whitesmoke" }}>
                  Stocks
                </span>
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavLayout;