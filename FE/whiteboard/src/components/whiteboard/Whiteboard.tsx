import React, { useEffect, createRef, useContext, useState } from "react";
import "./Whiteboard.css";
import { ColorContext } from "../../contexts/ColorContext";
import whiteboardBuilder, { whiteboard } from "../../hooks/facadeWhiteboard";
import Tools from "../tools/Tools";

export const Whiteboard = ({ socket }: any) => {
  const canvasRef = createRef<HTMLCanvasElement>();
  const whiteboardContainer = createRef<HTMLDivElement>();
  const [color, setColor] = useContext(ColorContext);
  const [lineWidth, setLineWidth] = useState(1);
  const [myCanvas, setMyCanvas] = useState<whiteboard>();
  let drawing = false;
  let tmp: whiteboard;
  useEffect(() => {
    if (canvasRef.current && whiteboardContainer.current)
      tmp = new whiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .build();
    setMyCanvas(tmp);
  }, []);

  const startPos = (e: any) => {
    drawing = true;
    draw(e, true);
  };

  const endPos = () => {
    drawing = false;
    myCanvas?.ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, isLocal: boolean) => {
    if (!drawing && isLocal) return;
    if (myCanvas) {
      if (isLocal) {
        const { scrollX, scrollY } = window;
        const offsetX = e.clientX - myCanvas.canvas.offsetLeft + scrollX;
        const offsetY = e.clientY - myCanvas.canvas.offsetTop + scrollY;
        const data = myCanvas.draw(offsetX, offsetY, { color, lineWidth });
        socket.emit("draw", data);
      } else {
        myCanvas.draw(e.clientX, e.clientY, e);
      }
    }
  };
  socket.on("draw", (e: any) => {
    draw(e, false);
  });
  const clearCanvas = () =>
    myCanvas?.ctx.clearRect(
      0,
      0,
      myCanvas.canvas.width,
      myCanvas.canvas.height
    );

  const paintCanvas = () => {
    myCanvas!.ctx.fillStyle = color;
    myCanvas!.ctx.fillRect(
      0,
      0,
      myCanvas?.canvas.width,
      myCanvas?.canvas.height
    );
  };
  const brushSizeSet = (e: any) => {
    setLineWidth(e);
  };

  const saveCanvas = ()=>{
    const b = myCanvas?.saveWhiteboard('jpg')
  }

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
          onMouseMove={e => {
            draw(e, true);
          }}
        ></canvas>
      </div>
      <Tools
        canvasContext={clearCanvas}
        brushSize={brushSizeSet}
        paintCanvas={paintCanvas}
        saveCanvas={saveCanvas}
      />
      <div>
      </div>
    </div>
  );
};