import React, { useEffect, createRef, useContext, useState } from "react";
import "./whiteboard.css";
// import { Chatwindow } from "../chatwindow/chatwindow";
import { ColorPalete } from "../colorPalete/colorPalete";
import { ColorContext } from "../../contexts/colorContext";
import { Link } from "react-router-dom";
import whiteboardBuilder ,{whiteboard}from "../../hooks/facadeWhiteboard";
import Tools from '../tools/Tools'


export const Whiteboard = ({ socket }: any) => {

  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  const [lineWidth,setLineWidth] = useState(1);
  const [myCanvas,setMyCanvas] = useState<whiteboard>(
    );
  let drawing = false;
let tmp:whiteboard;
  useEffect(() => {
    if (canvasRef.current && whiteboardContainer.current)
     tmp = new whiteboardBuilder(canvasRef.current)
    .withHeight(whiteboardContainer.current.clientHeight)
    .withWidth(whiteboardContainer.current.clientWidth)
    .build()
    setMyCanvas(tmp);
    socket.on("m", (e: any) => {
      draw(e,false);
    });
  }, []);

  const startPos = (e: any) => {
    drawing = true;
    draw(e,true);
  };

  const endPos = () => {
    drawing = false;
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d");
      if (ctx) ctx.beginPath();
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>,isLocal:boolean) => {
    if (!drawing && isLocal) return;
    const bound = canvasRef.current?.getBoundingClientRect();
    if (bound?.left != null && bound?.top != null && canvasRef.current && myCanvas) {
      const { scrollX, scrollY } = window;
      const offsetX = e.clientX - canvasRef.current.offsetLeft + scrollX;
      const offsetY = e.clientY - canvasRef.current.offsetTop + scrollY;
      const data = myCanvas.draw(offsetX, offsetY, {color,lineWidth});
      if(isLocal) socket.emit("m", data);
    }
  };

  const clearCanvas = () => {
  if(canvasRef.current) canvasRef.current.getContext('2d')!.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)    
  }
  const brushSizeSet = (e:any) =>{
    setLineWidth(e)
  } 
  const drawFromServer = (e: any) => {
    const bound = canvasRef.current?.getBoundingClientRect();
      if (bound?.left != null && bound?.top  && canvasRef.current && myCanvas) {
      const {scrollX,scrollY} = window;
      const offsetX = e.clientX - canvasRef.current.offsetLeft+scrollX;
      const offsetY = e.clientY - canvasRef.current.offsetTop + scrollY;
       myCanvas.draw(offsetX, offsetY, {color,lineWidth});
    }
  };

  // window.addEventListener("mousemove", draw);

  return (
    <div>

      <div
        className="col s12 m12 l12 whiteboard-container"
        ref={whiteboardContainer}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startPos}
          onMouseUp={endPos}
          onMouseMove={e=>{
            draw(e,true)
          }}
        ></canvas>
      </div>
      <Tools canvasContext={clearCanvas} brushSize={brushSizeSet}/>
    </div>
  );
};
