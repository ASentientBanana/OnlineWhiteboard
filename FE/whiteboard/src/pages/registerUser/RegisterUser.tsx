import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import './RegisterUser.css'
import { NameContext } from '../../contexts/NameProvider';
export const RegisterUser = ({ socket }: any) => {
  const [userName, setUserName] = useState<string>("Jane Doe");
  const [roomName, setRoomName] = useState<string>("Jane Does Room");
  const [nameCtx, setNameCtx] = useContext(NameContext);

  const registerUser = () => {
    if(!userName) return;
    fetch('http://127.0.0.1:4001/authenticateUser', {
      method:'POST',
      headers: {"Content-type": "application/json"},
      body:JSON.stringify({data:{
        userName,
        roomName
      }})
    })
    // setNameCtx(name);
    // socket.emit('join_room', roomName) //salje event join room serveru i objekat koji sadrzi imei sobu u koju bi da udje korisnik
  }

  return (
    <div className="container center register-user-page-container">
      <h1>Online Pantomime</h1>
      <form action='/room' method='POST' >
        <label htmlFor="username"><h4>Enter user name</h4></label>
        <input
          type="text"
          name="username"
          onChange={(e: any) => {
            setUserName(e.target.value);
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
          // /draw/${name}
          pathname: `/draw/${userName}?roomName=${roomName}`,
        }}>
          <div className="waves-effect waves-light btn join-btn" onClick={registerUser}><i className="material-icons left">brush</i>Join/Create  Room</div>
        </Link>
      </form>
    </div>
  );
};
