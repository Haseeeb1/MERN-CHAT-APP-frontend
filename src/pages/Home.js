import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import "./Home.css";

function Home() {
  const user = useSelector((state) => state.user);

  function refresh() {
    window.location.reload();
  }

  function timeFunction() {
    setTimeout(function () {
      window.location.reload();
    }, 70);
  }
  return (
    <Row>
      
      <Col
        md={6}
        className="d-flex flex-direction-column align-items-center justify-content-center"
      >
        <div>
        

          <h1 className="share"><span>Share</span> <span>the</span> <span>world</span> <span>with</span> <span>your</span> <span>friends</span></h1>
          <p className="instant"><span class="title-word title-word-1">Instant &nbsp;</span>
    <span >Personal &nbsp;</span>
    <span >and &nbsp;</span>
    <span>group &nbsp;</span>
    <span>Chatting &nbsp;</span>
    </p>
          {user && (
            <LinkContainer to="/chat">
              <Button variant="success" onClickCapture={timeFunction}>
                Get started{" "}
                <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
          )}
          {!user && (
            <LinkContainer to="/login">
              <Button variant="success">
                Login <i className="fas fa-comments home-message-icon"></i>
              </Button>
            </LinkContainer>
          )}
        </div>
      </Col>
      <Col md={6} className="home__bg"></Col>
    </Row>
  );
}

export default Home;
/*<i className="fa-brands fa-js js_icon"></i>
        <i className="fa-brands fa-react react_icon"></i>
        */