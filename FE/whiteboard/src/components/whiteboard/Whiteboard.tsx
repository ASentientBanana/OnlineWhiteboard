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
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  // const defaultCanvasColor = "#d8c1c1";
  // let drawing = false;
  let tmp: whiteboard;
  useEffect(() => {
    socket.on('isOwner', (e: any) => {
      console.log(e);
      if (e == 200) {
        setIsOwner(true);
      }
    });
    if (canvasRef.current && whiteboardContainer.current)
      tmp = new whiteboardBuilder(canvasRef.current)
        .withHeight(whiteboardContainer.current.clientHeight)
        .withWidth(whiteboardContainer.current.clientWidth)
        .withBackgroundColor("#d8c1c1")
        .build();
    setMyCanvas(tmp);
  }, []);

  const startPos = (e: any) => {
    setIsClicked(true);
    setDrawing(true);
    myCanvas?.setCanvasImageData();
    // draw(e, true,isOwner);
  };

  const endPos = () => {
    setIsClicked(true);
    setDrawing(false);
    myCanvas?.clearShapeArray();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>, isLocal: boolean, isOwner: boolean) => {

    if (!drawing && isLocal) return;
    isOwner = true; //izbaci ovo
    if (myCanvas && isOwner && isClicked) {
      if (isLocal) {
        const { scrollX, scrollY } = window;
        const offsetX = e.clientX - myCanvas.canvas.offsetLeft + scrollX;
        const offsetY = e.clientY - myCanvas.canvas.offsetTop + scrollY;
        const data = myCanvas.drawShape(offsetX, offsetY, { color , lineWidth, shape:"circle"});
        socket.emit("draw", data);
      } else {
        console.log(e);
        // const {color,lineWidth,shape} = e;
        // myCanvas.drawShape(e.clientX, e.clientY,{e.color,} ,);
      }
    }
  };
  socket.on("draw", (e: any) => {
    draw(e, false, true);
  });
  const clearCanvas = () =>
{
      myCanvas?.clearCanvas();
}

  const paintCanvas = () => {
    myCanvas?.paintCanvas(color);
  };
  const brushSizeSet = (e: any) => {
    setLineWidth(e);
  };

  const saveCanvas = () => {
    const b = myCanvas?.saveWhiteboard('jpg')
  }

  window.addEventListener('mouseup', () => {
    setIsClicked(false)
  })
  return (
    <div>
      <div
        className="col s12 m12 l12 whiteboard-container"
        ref={whiteboardContainer}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startPos}
          onMouseUp={() => {
            endPos()
          }}
          onMouseLeave={() => {
            setDrawing(false);
          }}
          onMouseEnter={() => {
            setDrawing(true);
          }}
          onMouseMove={e => {
            draw(e, true, isOwner);
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
