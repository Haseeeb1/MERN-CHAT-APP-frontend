import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/esm/Button";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import logo1 from "../assets/logo1.png";
import { useLogoutUserMutation } from "../services/appApi";
import "./Navigation.css";
import cookie from "react-cookie";
import { BrowserRouter } from "react-router-dom";

function Navigation() {
  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();
  async function handleLogout(e) {
    e.preventDefault();
    await logoutUser(user);
    cookie.remove("jwtoken");
    window.location.replace("/");
  }

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
        <LinkContainer to="/">
          <Navbar.Brand href="#home">
            <img src={logo} style={{ height: 50, width: 50 }} />
          </Navbar.Brand>
        </LinkContainer>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
                <LinkContainer className="Login-click" to="/signup">
                  <Nav.Link className="login-tag">Signup</Nav.Link>
                </LinkContainer>
                <LinkContainer className="Login-click" to="/login">
                  <Nav.Link className="login-tag">Login</Nav.Link>
                </LinkContainer>
                <LinkContainer className="Login-click" to="/changepassword">
                  <Nav.Link className="change-tag">Change Password</Nav.Link>
                </LinkContainer>
              </>
            )}
            {user && (
              <LinkContainer className="Chat-label" to="/chat">
                <Nav.Link>
                  <span className="chat-text">Chat</span>
                </Nav.Link>
              </LinkContainer>
            )}
            {user && (
              <NavDropdown
                className="dropdown"
                title={
                  <>
                    <img
                      src={user.picture}
                      style={{
                        width: 30,
                        height: 30,
                        marginRight: 10,
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                    <span className="user-text">{user.name}</span>
                  </>
                }
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item>
                  <Button variant="danger" onClick={handleLogout}>
                    Logout
                  </Button>
                </NavDropdown.Item>
              </NavDropdown>
            )}
            <LinkContainer to="/">
              <Navbar.Brand href="#home">
                <img
                  className="logo-nust"
                  src={logo1}
                  style={{ height: 50, width: 50 }}
                />
              </Navbar.Brand>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
