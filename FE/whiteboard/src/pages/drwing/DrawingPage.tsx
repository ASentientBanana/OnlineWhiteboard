import React, { useEffect } from "react";
import { Whiteboard } from "../../components/whiteboard/whiteboard";
import { Chatwindow } from "../../components/chatwindow/chatwindow";
import { ColorPalete } from "../../components/colorPalete/colorPalete";
import {useParams} from 'react-router-dom';
import "./DrawingPage.css";

export const DrawingPage = ({socket,match}: any,) => {
  const {name} = useParams()
  useEffect(()=>{
  },[])
  return (
    <div className="row drawing-page-container">
      <h1 className="center">{`${name}'s whiteboard`}</h1>
      <Whiteboard socket={socket} />
      <div className="col s12 m6 l6">
        <Chatwindow socket={socket} />
      </div>
    </div>
  );
};
