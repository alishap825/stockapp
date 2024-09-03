
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import tag from "../image/stockimg.png";

import { LinkContainer } from 'react-router-bootstrap'

function NavLayout() {
  return (
    <Navbar bg="dark" expand="lg">
      <Container fluid>
      <Navbar.Brand  to="/">
          <img src={tag} width="50" height="50" alt="Stocks"
          style={{
            borderRadius: "50%",
          }} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
             <LinkContainer to="/">
            <Nav.Link href="#Home">
              <span style={{
                color: "whitesmoke"
              }}>
              Home
              </span>
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/stocks">
            <Nav.Link href="#stocks">
              <span style={{
                color: "whitesmoke"
              }}>
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