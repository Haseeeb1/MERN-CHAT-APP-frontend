import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AdminSidebar from "../components/AdminSidebar.js";
import MessageForm from "../components/MessageForm.js";
import { useSelector } from "react-redux";
import { AppContext, socket } from "../context/appContext";

function Chat() {
  return (
    <Container>
      <Row>
        <Col md={4}>
          <AdminSidebar />
        </Col>
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}

export default Chat;
