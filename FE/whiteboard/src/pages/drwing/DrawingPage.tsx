import React, { useEffect,useRef } from "react";
import { Whiteboard } from "../../components/whiteboard/Whiteboard";
import { Chatwindow } from "../../components/chatwindow/Chatwindow";
import { useParams } from "react-router-dom";
import "./DrawingPage.css";
import WinnerBanner from '../../components/winnerBaner/WinerBanner'
import io from "socket.io-client";

export const DrawingPage = ({location}:any) => {
  const isConnected = useRef<boolean>(false);
  const socket:SocketIOClient.Socket = io("http://localhost:4002")
  const {name,room} = useParams<any>();
  const myParams = new URLSearchParams(location.search)
  const query = myParams.get('roomName');

    
  socket.on('connect',()=>{
    const data = {roomName:room,userName:name};
    socket.emit('joinRoom',data)
  })

  socket.on('correctGuess',(data:any)=>{
    const {winnerName,guess} = data;
    console.log(`${winnerName} WON WITH THE GUESS ${guess}`);
  })

  
  useEffect(() => {
  }, []);
  return (
    <>
      <WinnerBanner />
      <div className="container center drawing-page-container">
        <div className="">
          <Whiteboard  socket={socket} nameInfo={{roomName:room,userName:name}}/>
          <Chatwindow socket={socket} nameInfo={{roomName:room,userName:name}} />
        </div>

      </div>
    </>
  );
};
