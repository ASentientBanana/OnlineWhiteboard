import React, { useEffect, createRef, useContext, useState } from "react";
import "./whiteboard.css";
import { Chatwindow } from "../chatwindow/chatwindow";
import { ColorPalete } from "../colorPalete/colorPalete";
import { ColorContext } from "../../contexts/colorContext";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export const Whiteboard = () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  let drawing = false;
  const [s,ss] = useState<any>();
  const setupCanvasSize = (canvasElem: HTMLCanvasElement) => {
    const aspect = canvasElem.height / canvasElem.width,
      width = window.innerWidth * 0.6,
      height = window.innerHeight;
    canvasElem.width = width;
    canvasElem.height = Math.round(width * aspect);
  };
  useEffect(() => {
    socket.on("m", (e: any) => {
      drawFromServer(e);
      
      console.log(e);
    });

    window.addEventListener("resize", () => {
      if (canvasRef.current) {
        setupCanvasSize(canvasRef.current);
      }
    });
    if (canvasRef.current) {
      setupCanvasSize(canvasRef.current);
    }
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
    if (bound?.left && bound?.top) {
      const offsetX = e.clientX - bound?.left;
      const offsetY = e.clientY - bound?.top;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.lineTo(offsetX, offsetY);
          ctx.strokeStyle = color;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY);
          const data = {
            clientX: offsetX,
            clientY: offsetY,
            color: color,
            lineWidth: ctx.lineWidth,
            lineCap:ctx.lineCap = "round",
          };
          // Send the drawing data
          socket.emit("m", data);
        }
      }
    }
  };

  const drawFromServer = (e: any) => {
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left && bound?.top) {
      const offsetX = e.clientX - bound?.left;
      const offsetY = e.clientY - bound?.top;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.lineWidth = e.lineWidth;
          ctx.lineCap = e.lineCap
          ctx.lineTo(offsetX, offsetY);
          ctx.strokeStyle = e.color;
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY);

        }
      }
    }
  };

  window.addEventListener("mouseup", endPos);
  const saveCanvas = (e:any)=>{
    const tmp  = canvasRef.current?.toDataURL();
    ss(tmp);
  }
  return (
    <div ref={whiteboardContainer} className=" container center whiteboard">
      <canvas
        ref={canvasRef}
        onMouseDown={startPos}
        onMouseUp={endPos}
        onMouseMove={draw}
      ></canvas>
      <div className='row'>
        <a href={s} className='col s6'>downlaod</a>
      <a className="waves-effect waves-light btn 'col s6'" onClick={saveCanvas}>button</a>
      </div>
      <Chatwindow  socket={socket}/>
      {/* <ColorPalete /> */}
    </div>
  );
};
