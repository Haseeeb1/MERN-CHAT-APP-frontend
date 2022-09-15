import React, { useContext, useEffect, useState } from "react";
import { Col, ListGroup, ListGroupItem, Row, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from "../context/appContext";
import { addNotifications, resetNotifications } from "../features/userSlice";
import "./adminSidebar.css";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";

function Sidebar() {
  const [groupName, setGroupName] = useState("");
  let arr = [];
  const user = useSelector((state) => state.user);
  const {
    socket,
    setMembers,
    members,
    setCurrentRoom,
    setRooms,
    privateMemberMsg,
    rooms,
    setPrivateMemberMsg,
    currentRoom,
  } = useContext(AppContext);
  const dispatch = useDispatch();

  function joinRoom(room, isPublic = true) {
    if (!user) {
      return alert("Please Login");
    }
    socket.emit("join-room", room, currentRoom);
    setCurrentRoom(room);

    if (isPublic) {
      setPrivateMemberMsg(null);
    }
    dispatch(resetNotifications(room));
  }

  function addRoom() {
    rooms.push("crypto");
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentRoom !== room) dispatch(addNotifications(room));
  });

  useEffect(() => {
    if (user) {
      setCurrentRoom("");
      getRooms();
      socket.emit("new-user");
    }
  }, []);

  socket.off("new-user").on("new-user", (payload) => {
    setMembers(payload);
  });

  function getRooms() {
    fetch(`http://localhost:5001/rooms`)
      .then((res) => res.json())
      .then((data) => setRooms(data));
  }

  function orderIds(id1, id2) {
    if (id1 > id2) {
      return id1 + "-" + id2;
    } else {
      return id2 + "-" + id1;
    }
  }

  let id;

  function handlePrivateMemberMsg(member) {
    setPrivateMemberMsg(member);
    const roomId = orderIds(user._id, member._id);
    joinRoom(roomId, false);
  }

   function removeUser(id) {
    socket.emit("remove-user", id);
    window.location.reload();
  }
  async function onCreate(e) {
    e.preventDefault();
    if (rooms.indexOf(groupName) !== -1) {
      alert("Name already exists,Choose a different name!");
      return;
    }
   await socket.emit("add-group", groupName, arr);
      getRooms();
  }


  function memberObject(member) {
    //setObject(prevArray => [...prevArray, member])
    arr.push(member);
    console.log(arr);
  }


  function deleteRoom(room) {
    socket.emit("delete-room", room);
    getRooms();
  }

  const [newMembers,setNewmembers]=useState([]);
  function search(word){
    let arr=[];
    for(let i=0; i<members.length; i++){
      if( members[i].name.includes(word)){
        arr.push(members[i]);
      }
      setNewmembers(arr);
    }
  }

  if (!user) {
    return <></>;
  }
  return (
    <>
      <h2 className="rooms-tag">All rooms</h2>
      <ListGroup className="rooms_box">
        {rooms.map((room, idx) => (
          <ListGroup.Item
            className="rooms_name"
            key={idx}
            onClick={() => joinRoom(room)}
            active={room == currentRoom}
            style={{
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {room}
            {currentRoom !== room && (
              <span className="badge rounded-pill bg-primary">
                {user.newMessages[room]}
              </span>
            )}
            <i
              onClick={() => {
                deleteRoom(room);
              }}
              class="fa-solid fa-trash-can"
            ></i>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Dropdown>
        <Dropdown.Toggle
          className="add-member"
          variant="success"
          id="dropdown-basic"
        >
          Create a room
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdown_data">
          <Form onSubmit={onCreate}>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label className="name_label">Name</Form.Label>
              <Form.Control
                className="field_input"
                type="text"
                placeholder="Enter Name"
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </Form.Group>
            <Dropdown>
              <Dropdown.Toggle
                className="dropdown__add"
                variant="success"
                id="dropdown-basic"
              >
                Add members
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown__data">
                <ListGroup className="grouplist">
                  {members.map((member) => (
                    <ListGroup.Item
                      key={member.id}
                      style={{
                        backgroundColor: "#e5e4e2",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Row>
                        <Col xs={2} className="member-status">
                          <img
                            src={member.picture}
                            className="member-status-img2"
                          />
                        </Col>
                        <Col xs={9} className="white-span">
                          {member._id === user?._id ? (
                            <>You</>
                          ) : (
                            <>{member.name}</>
                          )}
                        </Col>
                        <Col xs={1}>
                          <span className="badge rounded-pill bg-primary">
                            {user.newMessages[orderIds(member._id, user._id)]}
                          </span>
                        </Col>
                      </Row>
                      <Button
                        onClick={() => {
                          memberObject(member.email);
                        }}
                        className="add__user"
                      >
                        <i class="fa-solid fa-plus"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>

            <Button
              className="Create_group"
              variant="primary"
              type="submit"
            >
              Create
            </Button>
          </Form>
        </Dropdown.Menu>
      </Dropdown>
<div className="members_div">
      <h2 className="members-tag">Members</h2>
      <Form className="form_search" >
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Control
                className="field_input"
                type='text'
                placeholder="Search by Name"
               onChange={(e) => search(e.target.value)}
              />
            </Form.Group>
          </Form>
          </div>
      {newMembers.length>0?
<ListGroup className="grouplist">
        {newMembers.map((member) => (
          <ListGroup.Item
            className="list-full"
            key={member.id}
            style={{
              backgroundColor: "#e5e4e2",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
            active={privateMemberMsg?._id == member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member._id == user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img src={member.picture} className="member-status-img" />
                {member.status == "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9} className="white-span">
                &nbsp; &nbsp; &nbsp; &nbsp;
                {member._id === user?._id ? (
                  <>You</>
                ) : (
                  <>
                    {member.name}
                    {member.status == "offline" && "  (Offline) "}
                  </>
                )}
              </Col>
             
            </Row>
            <Col xs={1} className='column_icon'>
                <span className="badge rounded-pill bg-primary online_icon">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            <Button
              onClick={() => {
                removeUser(member._id);
              }}
              className="user-remove"
            >
              <i class="fa-solid fa-trash-can"></i>
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
:
      <ListGroup className="grouplist">
        {members.map((member) => (
          <ListGroup.Item
            className="list-full"
            key={member.id}
            style={{
              backgroundColor: "#e5e4e2",
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
            active={privateMemberMsg?._id == member?._id}
            onClick={() => handlePrivateMemberMsg(member)}
            disabled={member._id == user._id}
          >
            <Row>
              <Col xs={2} className="member-status">
                <img src={member.picture} className="member-status-img" />
                {member.status == "online" ? (
                  <i className="fas fa-circle sidebar-online-status"></i>
                ) : (
                  <i className="fas fa-circle sidebar-offline-status"></i>
                )}
              </Col>
              <Col xs={9} className="white-span">
             
                {member._id === user?._id ? (
                  <span className="member_name_text">You</span>
                ) : (
                  <span className="member_name_text">
                    {member.name}
                    
                  </span>
                )}
              </Col>
             
            </Row>
            <Col xs={1} className='column_icon'>
                <span className="badge rounded-pill bg-primary online_icon">
                  {user.newMessages[orderIds(member._id, user._id)]}
                </span>
              </Col>
            <Button
              onClick={() => {
                removeUser(member._id);
              }}
              className="user-remove"
            >
              <i class="fa-solid fa-trash-can"></i>
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
}
    </>
  );
}

export default Sidebar;
