import React, { useEffect, createRef, useContext, useState } from "react";
import "./whiteboard.css";
// import { Chatwindow } from "../chatwindow/chatwindow";
import { ColorPalete } from "../colorPalete/colorPalete";
import { ColorContext } from "../../contexts/colorContext";
import { Link } from "react-router-dom";

export const Whiteboard = ({ socket }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  let drawing = false;
  const [s, ss] = useState<any>();

  const setupCanvasSize = (canvasElem: HTMLCanvasElement) => {
    if (whiteboardContainer.current) {
      const aspect = canvasElem.height / canvasElem.width;

      canvasElem.width = whiteboardContainer.current?.clientWidth;
      canvasElem.height = whiteboardContainer.current?.clientHeight;
    }
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
    if (bound?.left != null && bound?.top != null) {
      const offsetX = e.clientX - bound.left;
      const offsetY = e.clientY - bound.top;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.lineWidth = 3;
          ctx.lineCap = "round";
          ctx.strokeStyle = color;
          ctx.lineTo(offsetX, offsetY);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(offsetX, offsetY);
          const data = {
            clientX: offsetX,
            clientY: offsetY,
            color: color,
            lineWidth: ctx.lineWidth,
            lineCap: ctx.lineCap = "round",
          };
          // Send the drawing data
          socket.emit("m", data);
        }
      }
    } else {
      console.log("ERR");
    }
  };

  const drawFromServer = (e: any) => {
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null) {
      const offsetX = e.clientX - bound?.left;
      const offsetY = e.clientY - bound?.top;
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext("2d");
        if (ctx) {
          ctx.lineWidth = e.lineWidth;
          ctx.lineCap = e.lineCap;
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
