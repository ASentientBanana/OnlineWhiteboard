import React, { useEffect } from "react";
import { Whiteboard } from "../../components/whiteboard/Whiteboard";
import { Chatwindow } from "../../components/chatwindow/Chatwindow";
import { useParams } from "react-router-dom";
import "./DrawingPage.css";
import WinnerBanner from '../../components/winnerBaner/WinerBanner'

export const DrawingPage = ({ socket }: any) => {
  const { name } = useParams<any>();
  useEffect(() => {
  }, []);
  return (
    <>
      <WinnerBanner />
      <div className="container center drawing-page-container">
        <div className="">
          <Whiteboard socket={socket} name={name}/>
        </div>
        <Chatwindow socket={socket} name={name} />
      </div>
    </>
  );
};
