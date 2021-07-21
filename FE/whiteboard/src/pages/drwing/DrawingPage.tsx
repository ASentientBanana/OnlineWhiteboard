import React, { useEffect } from "react";
import { Whiteboard } from "../../components/whiteboard/Whiteboard";
import { Chatwindow } from "../../components/chatwindow/Chatwindow";
import { useParams } from "react-router-dom";
import "./DrawingPage.css";
import WinnerBanner from '../../components/winnerBaner/WinerBanner'
import io from "socket.io-client";

export const DrawingPage = ({location}:any) => {
  const socket:SocketIOClient.Socket = io("http://localhost:4002")
  const params = useParams<any>();
  // console.log(params);
  const myParams = new URLSearchParams(location.search)
  const query = myParams.get('roomName');
  console.log(query);


  socket.on('connect',()=>{
    // socket.emit('sync',{id:socket.id,params.userName})
    socket.emit('joinRoom',{roomName:query,userName:params.userName})
  })
  useEffect(() => {
  }, []);
  return (
    <>
      <WinnerBanner />
      <div className="container center drawing-page-container">
        <div className="">
          <Whiteboard  socket={socket} nameInfo={{roomName:query,userName:params.userName}}/>
          <Chatwindow socket={socket} name={params.userName} />
        </div>

      </div>
    </>
  );
};
