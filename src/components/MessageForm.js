import React, { useContext, useEffect, useRef, useState } from "react";
import { Col, Form, Row, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext, socket } from "../context/appContext";
import "./MessageForm.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { saveAs } from "file-saver";
function MessageForm() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isfile, setIsFalse] = useState(false);
  let link = "";
  const user = useSelector((state) => state.user);
  const { socket, currentRoom, setMessages, messages, privateMemberMsg } =
    useContext(AppContext);
  let fileData;
  let deleted = false;
  const messageEndRef = useRef(null);
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fileChangeHandler = async (e) => {
    e.preventDefault();
    fileData = e.target.files[0];
    //console.log(e.target.files[0])
    var files = e.target.files;

    link = e.target.files[0].name;

  
    const data = new FormData();
    data.append("image", fileData);
    setIsFalse(true);
    if (link.length > 0) {
      setMessage(link);
    }
    //console.log(message);
    async function hello() {
      await fetch("http://localhost:5001/single", {
        method: "POST",
        body: data,
      })
        .then((result) => {
          //console.log("File sent successfully");
        })
        .catch((err) => {
          console.log(err.message);
        });
    }
    fileData = "";
    hello();
  };

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    return month + "/" + day + "/" + year;
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();

  socket.off("room-messages").on("room-messages", (roomMessages) => {
    setMessages(roomMessages);
  });

  function handleSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes =
      today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate, isfile);
    setIsFalse(false);
    setMessage("");
  }

  function deleteText(content) {
    // console.log(content);
    socket.emit("deleteMessage", content, currentRoom);
  }

  return (
    <>
      <div className="messages-output">
        {user && !privateMemberMsg?._id && (
          <div className="alert alert-info room-div">
            You are in the {currentRoom} room
          </div>
        )}

        {user && privateMemberMsg?._id && (
          <>
            <div className="alert alert-info conversation-info">
              <div>Your conversation with {privateMemberMsg.name}</div>
            </div>
          </>
        )}

        {!user && <div className="alert alert-danger">Please Login</div>}

        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center message-date-indicator">
                {date}
              </p>
              {messagesByDate?.map(
                ({ _id, content, time, from: sender, isFile }, msgIdx) => (
                  <div
                    className={
                      sender?.email == user?.email
                        ? "message"
                        : "incoming-message"
                    }
                    key={msgIdx}
                  >
                    <div className="message-inner">
                      <div className="d-flex align-items-center mb-0">
                        <p className="message-sender">
                          {sender._id == user?._id ? "You" : sender.name}
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                          {time}
                          {sender._id == user?._id && (
                            <label onClick={() => deleteText(_id)}>
                              <i className="fa-solid fa-trash-can trash_icon"></i>
                            </label>
                          )}
                        </p>
                      </div>
                      {isFile === true ? (
                        <>
                          <h6 className="tagfile">FILE </h6>
                          <p>{content}</p>
                          <a
                            className="filename"
                            href={"http://localhost:5001/resources/" + content}
                            target="_blank"
                            download
                          >
                            Click to download/open
                          </a>{" "}
                        </>
                      ) : (
                        <p className="message-content">{content}</p>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          ))}

        <div ref={messageEndRef} />
      </div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={11}>
            <Form.Group>
              <Form.Control
                className="message-box"
                type="text"
                placeholder="Your message"
                disabled={!user}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={1}>
            <Button
              className="button-fly"
              variant="primary"
              type="submit"
              style={{ width: "100%", backgroundColor: "orange" }}
              disabled={!user}
            >
              <i className="fas fa-paper-plane"></i>
            </Button>
            <label htmlFor="file-upload">
              <i className="fas fa-file-alt file-icon"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              hidden
              onChange={(e) => fileChangeHandler(e)}
            />
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default MessageForm;
