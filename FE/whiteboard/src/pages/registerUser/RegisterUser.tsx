import React, { useState } from "react";
import { Link } from "react-router-dom";

export const RegisterUser = ({socket}:any) => {
  const [name, setName] = useState<string>("Jane Doe");
  const [roomName, setRoomName] = useState<string>("Jane Doe");

  const submit = () => {};

  return (
    <div className="container center">
      <h1>Welcome</h1>
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
          pathname:`/draw/${name}`,
        }}>
          <button type="button" value="Register" onClick={ ()=>{
            socket.emit('join_room',roomName)
            // console.log(socket);
          }}>
            Join Room
          </button>
          <button type="button" value="Register" onClick={ ()=>{
            // socket.emit('joinRoom',{name,roomName})
            // console.log(socket);
          }}>
            Register Room
          </button>
        </Link>
      </form>
    </div>
  );
};
