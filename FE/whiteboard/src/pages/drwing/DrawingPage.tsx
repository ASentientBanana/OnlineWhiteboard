import React, { useEffect } from "react";
import { Whiteboard } from "../../components/whiteboard/Whiteboard";
import { Chatwindow } from "../../components/chatwindow/Chatwindow";
import { ColorPalete } from "../../components/colorPalete/ColorPalete";
import { useParams } from 'react-router-dom';
import "./DrawingPage.css";
import Tools from '../../components/tools/Tools'


export const DrawingPage = ({ socket }: any,) => {
  const { name } = useParams()
  useEffect(() => {
    socket.on('test',(e:any)=>{
      console.log(e);
      
    })
  }, [])
  return (
    <div className="container center drawing-page-container">
      {/* <h1 className="center">{`${name}'s whiteboard`}</h1> */}
      <Whiteboard socket={socket} />
      <Chatwindow socket={socket} />
    </div>
  );
};
