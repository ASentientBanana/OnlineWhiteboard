import React, { useEffect, createRef, useContext, useState } from "react";
import "./whiteboard.css";
// import { Chatwindow } from "../chatwindow/chatwindow";
import { ColorPalete } from "../colorPalete/colorPalete";
import { ColorContext } from "../../contexts/colorContext";
import { Link } from "react-router-dom";
import whiteboardBuilder from '../../hooks/facadeWhiteboard'
export const Whiteboard = ({ socket }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  let drawing = false;
  const [s, ss] = useState<any>();
  let mycanvas:any;

  useEffect(() => {
    console.log(whiteboardContainer.current?.clientHeight,whiteboardContainer.current?.clientWidth);
    
    if(canvasRef.current) mycanvas = new whiteboardBuilder(canvasRef.current).setSize(whiteboardContainer.current?.clientHeight,whiteboardContainer.current?.clientWidth).build();
    socket.on("m", (e: any) => {
      drawFromServer(e);

      console.log(e);
    });
  }, []);

  const startPos = (e: any) => {
    drawing = true;
    draw(e);
  };

  const endPos = () => {
    drawing = false;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const draw = (e: any) => {
    if (!drawing) return;
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null) {
      const offsetX = e.clientX - bound.left;
      const offsetY = e.clientY - bound.top;
      const data = mycanvas.clientDraw(offsetX,offsetY);
          // const data = facadeWhiteboard(ctx,offsetX,offsetY,color) ;
          // Send the drawing data
          socket.emit("m", data);
    }
  };

  const drawFromServer = (e: any) => {
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null) {
      const offsetX = e.clientX - bound?.left;
      const offsetY = e.clientY - bound?.top;
      mycanvas.drawFromServer(offsetX,offsetY);
      
    }
  };

  window.addEventListener("mouseup", endPos);
  const saveCanvas = (e: any) => {
    const tmp = canvasRef.current?.toDataURL();
    ss(tmp);
  };
  return (
    <div
      className="col s12 m6 l6 whiteboard-container"
      ref={whiteboardContainer}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={startPos}
        onMouseUp={endPos}
        onMouseMove={draw}
      ></canvas>
    </div>
  );
};
