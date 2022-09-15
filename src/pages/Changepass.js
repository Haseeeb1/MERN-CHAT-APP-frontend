import React, { useContext, useState } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Cookie from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/appContext";
import Cookies from "universal-cookie";
import { useLoginUserMutation } from "../services/appApi";
import "./Changepass.css";

function Changepassword() {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loginUser, { isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [same, setSame] = useState(false);
  async function response() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        oldPassword: oldPassword,
        newPassword: newPassword,
      }),
    };

    await fetch("http://localhost:5001/changepass", requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data == "updated") {
          setInvalid(false);
          setSame(false);
          setDone(true);
          return true;
        }
        setInvalid(true);
        setSame(false);
        setDone(false);
        return false;
      });
  }

  async function handlePasschange(e) {
    e.preventDefault();
    if (oldPassword == newPassword) {
      setSame(true);
      setOldPassword("");
      setNewPassword("");
      return;
    }

    if (response()) {
      setEmail("");
      setOldPassword("");
      setNewPassword("");
      return;
    }
  }

  return (
    <Container>
      <Row>
        <Col md={5} className="login__bg"></Col>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form
            style={{ width: "80%", maxWidth: 500 }}
            onSubmit={handlePasschange}
          >
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <Row>
                <h1 className="text-center login_text">
                  <span>Ch</span>
                  <span>ang</span>
                  <span>e</span>
                  <span>&nbsp; Pas</span>
                  <span>sw</span>
                  <span>ord</span>
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
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setOldPassword(e.target.value)}
                value={oldPassword}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Submit"}
            </Button>
            {done && <p className="text-center updated_tag">Updated</p>}
            {invalid && (
              <p className="text-center invalid_tag">
                Invalid email or password! Retry
              </p>
            )}
            {same && (
              <p className="text-center invalid_tag">
                New and old passwords can't be same!
              </p>
            )}
            <div className="py-4">
              <p className="text-center">
                LogIn now? <Link to="/login">Login</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Changepassword;
