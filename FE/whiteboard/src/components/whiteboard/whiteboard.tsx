import React, { useEffect, createRef, useContext } from "react";
import "./whiteboard.css";
import { Chatwindow } from "../chatwindow/chatwindow";
import {ColorPalete} from '../colorPalete/colorPalete';
import {ColorContext} from '../../contexts/colorContext';


export const Whiteboard = () => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color,serColor] = useContext(ColorContext);
  let data;
  let drawing = false;

  const setupCanvasSize = (canvasElem: HTMLCanvasElement) => {
        const aspect = canvasElem.height / canvasElem.width,
        width = window.innerWidth*0.6,
        height = window.innerHeight;
        canvasElem.width = width;
        canvasElem.height = Math.round(width * aspect);
    
  };
  useEffect(() => {

    
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
    if(bound?.left && bound?.top){
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
          data = {
            x: offsetX,
            y: offsetY,
          };
          // Ovde send :D
        }
      }
    }
  };
  
  window.addEventListener("mouseup",endPos);
  
  return (
    <div ref={whiteboardContainer} className=" container center whiteboard">
      <canvas
        ref={canvasRef}
        onMouseDown={startPos}
        onMouseUp={endPos}
        onMouseMove={draw}
      ></canvas>
      <Chatwindow />
      <ColorPalete />
    
    </div>
  );
};
