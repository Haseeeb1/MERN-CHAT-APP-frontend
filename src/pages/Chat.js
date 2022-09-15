import React, { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Sidebar from "../components/Sidebar.js";
import MessageForm from "../components/MessageForm.js";
import { useSelector } from "react-redux";
import { AppContext, socket } from "../context/appContext";
import AdminSidebar from "../components/AdminSidebar.js";
import cookies from "react-cookie";
import './Chat.css';
export function returnToken() {
  return cookies.load("jwtoken");
}

export function returnEmail() {
  return cookies.load("email");
}

function Chat() {
  
  const user = useSelector((state) => state.user);

  return (
    <Container>
      <Row>
        {user.name === "admin" &&
        user.email === "admin123@gmail.com" &&
        user._id === "631acb1e264428aea443bf00" ? (
          <Col md={4}>
            <AdminSidebar />
          </Col>
        ) : (
          <Col md={4}>
            <Sidebar />
          </Col>
        )}
        <Col md={8}>
          <MessageForm />
        </Col>
      </Row>
    </Container>
  );
}
export default Chat;
