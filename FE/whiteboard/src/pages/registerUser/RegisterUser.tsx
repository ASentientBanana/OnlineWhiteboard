import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import './RegisterUser.css'
import { NameContext } from '../../contexts/NameProvider';
export const RegisterUser = ({ socket }: any) => {
  const [name, setName] = useState<string>("Jane Doe");
  const [roomName, setRoomName] = useState<string>("Jane Doe");
  const [nameCtx, setNameCtx] = useContext(NameContext);
  const submit = () => { };

  return (
    <div className="container center register-user-page-container">
      <h1>Online Pantomime</h1>
      <form action='/room' method='POST' >
        <label htmlFor="username"><h4>Enter user name</h4></label>
        <input
          type="text"
          name="username"
          onChange={(e: any) => {
            setName(e.target.value);
          }}
        />
        <label htmlFor="room"><h4>Enter room name</h4></label>
        <input
          type="text"
          name="room"
          onChange={(e: any) => {
            setRoomName(e.target.value);
          }}
        />
        <Link to={{
          pathname: `/draw/${name}`,
        }}>
          <div className="waves-effect waves-light btn join-btn" onClick={() => {
            setNameCtx(name);
            socket.emit('join_room', roomName)
          }}><i className="material-icons left">brush</i>Join/Create  Room</div>
        </Link>
      </form>
    </div>
  );
};
