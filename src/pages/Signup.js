import React, { useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { useSignupUserMutation } from "../services/appApi.js";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";
import bot from "../assets/bot.png";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [signupUser, { isLoading, err }] = useSignupUserMutation();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [uploadingImg, setUploadingImg] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  let url;
  function validateImg(e) {
    const file = e.target.files[0];
    if (file.size >= 1048576) {
      return alert("Max File size is 1 mb");
    } else {
      setImagePreview(URL.createObjectURL(file));
      getBase64(file).then((data) => {
        url = data;
        setImage(url);
      });
    }
  }
  function timeFunction() {
    setTimeout(function () {
      window.location.reload();
      window.localStorage.clear();
    }, 30);
  }

  function handleSignup(e) {
    e.preventDefault();
    if (!image) return alert("please upload profile picture");
    signupUser({ name, email, password, picture: image }).then(
      async ({ data }) => {
        if (data) {
          navigate("/");
          timeFunction();
        }
        if (!data) {
          alert("Email already exists");
        }
      }
    );
  }

  return (
    <Container>
      <Row>
        <Col
          md={7}
          className="d-flex align-items-center justify-content-center flex-direction-column"
        >
          <Form style={{ width: "80%", maxWidth: 500 }} onSubmit={handleSignup}>
            <h1 className="text-center text_center">Create Account</h1>
            <div className="signup-profile-pic__container">
              <img src={imagePreview || bot} className="signup-profile-pic" />
              <label htmlFor="image-upload" className="image-upload-label">
                <i className="fas fa-plus-circle add-picture-icon"></i>
              </label>
              <input
                type="file"
                id="image-upload"
                hidden
                accept="image/png ,image/jpeg"
                onChange={validateImg}
              />
            </div>
            {err && <p className="alert alert-danger">{err.data}</p>}

            <Form.Group className="mb-3" controlId="formBasicName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Your Name"
                onChange={(e) => setName(e.target.value)}
                value={name}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
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
              {uploadingImg || isLoading ? "Signing You up..." : "Signup"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Already have an account <Link to="/LogIn">LogIn</Link>
              </p>
            </div>
          </Form>
        </Col>
        <Col md={5} className="signup__bg"></Col>
      </Row>
    </Container>
  );
}

export default Signup;
