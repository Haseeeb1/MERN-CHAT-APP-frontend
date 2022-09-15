import React, { useContext, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Cookie from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import Cookies from "universal-cookie";
import { useLoginUserMutation } from "../services/appApi";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);

  function handleLogin(e) {
    e.preventDefault();
    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit("new-user");
        navigate("/chat");
        window.location.reload();
      }
    });
  }

  return (
    <Container>
      <Row>
        <Col md={5} className="login__bg"></Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleLogin}>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
                <Row>
                  <h1 className="text-center login_text"><span>L</span>
                  <span>o</span>
                  <span>g</span>
                  <span>I</span>
                  <span>n</span>
                  </h1>
                </Row>
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Login"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account? <Link to="/signup">Signup</Link>
              </p>
            </div>
            <div className="py-4">
              <p className="text-center">
                Change password for your account? <Link to="/changepassword">Click here</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
