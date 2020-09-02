import React, { useEffect, createRef, useContext, useState } from "react";
import "./whiteboard.css";
// import { Chatwindow } from "../chatwindow/chatwindow";
import { ColorPalete } from "../colorPalete/colorPalete";
import { ColorContext } from "../../contexts/colorContext";
import { Link } from "react-router-dom";
import whiteboardBuilder from "../../hooks/facadeWhiteboard";
export const Whiteboard = ({ socket }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  let drawing = false;
  const [s, ss] = useState<any>();
  let mycanvas: any;

  useEffect(() => {
    if (canvasRef.current && whiteboardContainer.current)
      mycanvas = new whiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .build();
    socket.on("m", (e: any) => {
      drawFromServer(e);
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
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null && canvasRef.current) {
      const {scrollX,scrollY} = window;
      const offsetX = e.clientX - canvasRef.current.offsetLeft+scrollX;
      const offsetY = e.clientY - canvasRef.current.offsetTop + scrollY;
      const data = mycanvas.draw(offsetX, offsetY);
      socket.emit("m", data);
    }
  };

  const drawFromServer = (e: any) => {
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null && canvasRef.current) {
      const {scrollX,scrollY} = window;
      const offsetX = e.clientX - canvasRef.current.offsetLeft+scrollX;
      const offsetY = e.clientY - canvasRef.current.offsetTop + scrollY;
      mycanvas.draw(offsetX, offsetY);
    }
  };

  window.addEventListener("mouseup", endPos);
  const saveCanvas = (e: any) => {
    const tmp = canvasRef.current?.toDataURL();
    ss(tmp);
  };
  return (
    <div
      className="col s12 m12 l12 whiteboard-container"
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
