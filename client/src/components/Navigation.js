import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
export const Navigation = () => {
  return (
    <div>
      <Navbar style={{ height: 60 }} bg="dark" variant="dark">
        <Container>
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/signup">Sign Up</Nav.Link>
            <Nav.Link href="/login">Sign In</Nav.Link>
            <Nav.Link href="/main">Main</Nav.Link>
            <Nav.Link href="/private">Private</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </div>
  );
};
